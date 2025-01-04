import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      isGuest?: boolean;
      name: string;
      email: string;
      image: string;
    };
  }
}