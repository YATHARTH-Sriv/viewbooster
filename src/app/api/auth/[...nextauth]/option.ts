import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        // Create an ephemeral guest user without database storage
        return {
          id: `guest_${uuidv4()}`,
          name: "Guest User",
          email: null,
          image: null,
          isGuest: true,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Only handle database operations for Google sign-in
      if (account?.provider === "google") {
        const { id, email, name, image } = user;

        // Check if the user exists in the database
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("google_id", id)
          .single();

        if (error) {
          // User does not exist, insert into the database
          const { error: insertError } = await supabase
            .from("users")
            .insert({
              google_id: id,
              email,
              name,
              image,
            });

          if (insertError) {
            console.error("Error saving user to database:", insertError);
            return false;
          }
        }
      }

      // Always allow sign in
      return true;
    },
    async session({ session, token }) {
      // Add isGuest flag to session
      return {
        ...session,
        user: {
          ...session.user,
          isGuest: token.isGuest as boolean,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        // Add isGuest flag to JWT token
        token.isGuest = (user as any).isGuest || false;
      }
      return token;
    },
  },
};