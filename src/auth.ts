// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { Organization, User } from "./server/models";
import { initDB } from "./server/config/db";

// Remember to connect to your DB first
// (await sequelize.authenticate()) somewhere if not already connected

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Passcode or Password", type: "password" },
        role: { label: "Role", type: "text" },
        employeeId: { label: "EmployeeId", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        await initDB();
        console.log(credentials);
        // find the user by email first
        const user = await User.findOne({
          where: { email: credentials.email },
          include: [
            {
              model: Organization,
              as: credentials.role === "admin" ? "adminOf" : "organization",
            },
          ],
        });

        // console.log(user)

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) throw new Error("InvalidCredentials");

        if (!user.isActive) throw new Error("AccountSuspended");
        if (!user.isVerified) throw new Error("AccountUnverified");

        if (credentials.role === "admin") {
          // Organization: match password normally

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            organization: {
              id: user.adminOf.id,
              name: user.adminOf.name,
              slug: user.adminOf.slug,
              avatar: user.adminOf.logoUrl,
            },
          };
        } else if (credentials.role === "employee") {
          // Employee: match passcode == password and match IDs
          if (credentials.employeeId !== user.employeeId) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            organization: {
              id: user.organization.id,
              name: user.organization.name,
              slug: user.organization.slug,
              avatar: user.organization.logoUrl,
            },
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    error: "/auth/login",
    signIn: "/auth/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.organization = user.organization;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.role) {
        (session as any).role = token.role;
        (session as any).id = token.id;
        (session as any).name = token.name;
        (session as any).email = token.email;
        (session as any).organization = token.organization;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 30, // 30 minutes in seconds
    updateAge: 60 * 10, // refresh expiration if the user is active
  },
  secret: process.env.NEXTAUTH_SECRET,
});
