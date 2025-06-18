import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    name: string;
    email: string;
    organization: {
      id: string;
      name: string;
      slug: string;
      avatar: string;
    };
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
