"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verifyEmail = async () => {
      try {
        setStatus("loading");
        const res = await axios.post("/api/auth/verify", { token, email });
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Verification failed.");
      }
    };

    verifyEmail();
  }, [token, email]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardContent className="p-6 space-y-6 text-center">
          {status === "loading" && (
            <Alert>
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <AlertTitle>Verifying...</AlertTitle>
              <AlertDescription>Please wait while we verify your email.</AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <Alert variant="default">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
              <Button className="mt-4" asChild>
                <Link href="/auth/login">Go to Login</Link>
              </Button>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <XCircle className="w-5 h-5 text-red-600" />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
