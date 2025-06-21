"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility for conditional class merging

export default function VerifyEmailPage() {
  const { token } = useParams();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "expired"
  >("idle");
  const [message, setMessage] = useState("");

  // New states for resend functionality
  const [resendStatus, setResendStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verifyEmail = async () => {
      try {
        setStatus("loading");
        const res = await axios.post("/api/auth/verify", { token });
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");
      } catch (err: any) {
        console.log(err.response);
        // Check for specific error responses, e.g., token expired
        if (err.response && err.response.status === 410) {
          // Example status code for expired
          setStatus("expired");
          setMessage("Your verification link has expired.");
        } else {
          setStatus("error");
          setMessage(err.message || "Verification failed.");
        }
      }
    };

    verifyEmail();
  }, [token, email]);

  const resendVerification = async () => {
    if (!email) {
      setResendStatus("error"); // Use resendStatus for this specific error
      setResendMessage("Email is required to resend verification.");
      return;
    }
    try {
      setResendStatus("loading");
      setResendMessage("Sending new verification email...");
      const res = await axios.post("/api/auth/verify/resend", { email });
      setResendStatus("success");
      setResendMessage(
        res.data.message ||
          "New verification email sent successfully! Please check your inbox."
      );
    } catch (err: any) {
      console.error(err);
      setResendStatus("error");
      setResendMessage(
        err.response.data.error ||
          "Failed to resend verification email. Please try again later."
      );
    }
  };

  const getCardClasses = (currentStatus: typeof status) => {
    switch (currentStatus) {
      case "success":
        return "text-green-700"; // Light green for success
      case "error":
        return "text-red-700"; // Light red for error
      case "expired":
        return "text-yellow-700"; // Light yellow for expired
      case "loading":
        return ""; // Light blue for loading/info
      default:
        return ""; // Default styling
    }
  };

  const getResendButtonText = () => {
    if (resendStatus === "loading") {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      );
    }
    return "Resend Verification Email";
  };

  return (
   
      <Card className={cn("max-w-md w-full shadow-xl", getCardClasses(status))}>
        <CardHeader className="text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <CardTitle>Verifying...</CardTitle>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <CardTitle>Success!</CardTitle>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <CardTitle>Verification Failed</CardTitle>
            </>
          )}

          {status === "expired" && (
            <>
              <XCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <CardTitle>Token Expired</CardTitle>
            </>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-6 text-center pt-0">
          <CardDescription className="text-base">
            {status === "loading" && "Please wait while we verify your email."}
            {status === "success" && message}
            {status === "error" && message}
            {status === "expired" &&
              "Your verification token has expired. Please request a new one."}
          </CardDescription>

          {(status === "success" ||
            status === "expired" ||
            status === "error") && (
            <div className="flex flex-col space-y-2">
              {status === "success" && (
                <Button asChild>
                  <Link href="/auth/login">Go to Login</Link>
                </Button>
              )}
              {(status === "error" || status === "expired") && (
                <>
                  <Button
                    onClick={resendVerification}
                    disabled={resendStatus === "loading"} // Disable button when resending
                  >
                    {getResendButtonText()}
                  </Button>
                  {/* Display resend status message below the button */}
                  {resendStatus !== "idle" && resendMessage && (
                    <p
                      className={cn(
                        "text-sm mt-2",
                        resendStatus === "success" && "text-green-600",
                        resendStatus === "error" && "text-red-600"
                      )}
                    >
                      {resendMessage}
                    </p>
                  )}
                  <Button variant="outline" asChild>
                    <Link href="/">Go Home</Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
  );
}
