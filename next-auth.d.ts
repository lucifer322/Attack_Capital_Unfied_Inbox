import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extending the built-in User type
declare module "next-auth" {
  interface User extends DefaultUser {
    role: string;
  }

  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}

// Extending the built-in JWT type
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
