import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

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
  ],
  callbacks: {
    async signIn({ user }) {
      // Extract user information
      const { id, email, name, image } = user;

      // Check if the user exists in the database
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("google_id", id)
        .single();

      if (error && error.code === "PGRST116") {
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
          return false; // Fail the sign-in process
        }
      } else if (error) {
        // Log unexpected errors
        console.error("Error fetching user from database:", error);
        return false; // Fail the sign-in process
      }

      // User exists or was successfully created
      return true;
    },
  },
};
