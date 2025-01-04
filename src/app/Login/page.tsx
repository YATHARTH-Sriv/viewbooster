"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleGuestLogin = () => {
    signIn("guest", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 md:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Welcome to ViewBoost
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Login to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Button
            variant="outline"
            className="h-12 gap-2 w-full"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Login with Google
            <FcGoogle className="mr-2 h-5 w-5" />
          </Button>
          <Button
            variant="default"
            className="h-12 w-full"
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
