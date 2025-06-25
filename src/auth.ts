// src/app/api/auth/[...nextauth]/route.ts
export const runtime = "nodejs";

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
      authorize: async (credentials) => {
        if (!credentials?.email) return null;
        await initDB();
        const user = await User.findOne({
          where: { email: credentials.email },
          include: [
            {
              model: Organization,
              as: credentials.role === "admin" ? "adminOf" : "organization",
            },
          ],
        });

        if (!user) {
          (credentials as any).error = "User not found";
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          (credentials as any).error = "Invalid password";
          return null;
        }

        if (!user.isActive) {
          (credentials as any).error = "Account Suspended";
          return null;
        }

        if (!user.isVerified) {
          (credentials as any).error = "Account Unverified";
          return null;
        }

        if (credentials.role === "admin") {
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
              passcode: !!user.adminOf.passcode,
            },
          };
        } else if (credentials.role === "employee") {
          if (credentials.employeeId !== user.employeeId) {
            (credentials as any).error = "Invalid Employee ID";
            return null;
          }

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

        (credentials as any).error = "Invalid role";
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // console.log(user);
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    session: async ({ session, token }) => {
      // console.log(token);
      if (token?.role) {
        session.user = token;
      }
      // console.log(session);
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, 
    updateAge: 60 * 10, // refresh expiration if the user is active
  },
  secret: process.env.NEXTAUTH_SECRET,
});
