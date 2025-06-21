"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <Card className="max-w-xl w-full shadow-lg">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Registration Successful!
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-muted-foreground text-center">
          Thank you for registering. {"We've"} sent a verification email to your
          inbox. Please check your email and verify your account to continue.
        </p>

        {/* Illustration placeholder */}
        <div className="w-full flex justify-center">
          <Image
            src="/assets/success-reg.svg" // Replace with your actual image path
            alt="Check your email"
            width={240}
            height={200}
          />
        </div>

        <div className="text-center">
          <Button asChild>
            <Link href="/auth/login">Go to Login</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
