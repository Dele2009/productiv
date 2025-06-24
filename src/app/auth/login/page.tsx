"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/passwordinput";

const adminLoginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password required"),
});

const employeeLoginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email required"),
  employeeId: yup.string().required("Employee ID required"),
  orgPasscode: yup.string().required("Organization passcode required"),
});
const errors = {
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  InvalidCredentials: "Email or password is incorrect.",
  AccountSuspended: "Your account has been suspended.",
  AccountUnverified: "Your account is not verified.",
  default: "Unable to sign in.",
};

type Errors = typeof errors;
type AdminLoginData = yup.InferType<typeof adminLoginSchema>;
type EmployeeLoginData = yup.InferType<typeof employeeLoginSchema>;

const SignInError = ({ error }: { error: keyof Errors }) => {
  const errorMsg = errors[error] || error;
  return (
    <Alert variant="destructive">
      <CheckCircle2Icon />
      <AlertTitle>Login Error</AlertTitle>
      <AlertDescription>{errorMsg}</AlertDescription>
    </Alert>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const [activeTab, setActiveTab] = useState<"admin" | "employee" | string>(
    "admin"
  );

  // Admin form
  const {
    register: registerAdmin,
    handleSubmit: handleSubmitAdmin,
    formState: { errors: adminErrors, isSubmitting: adminSubmitting },
  } = useForm<AdminLoginData>({
    resolver: yupResolver(adminLoginSchema),
  });

  // Employee form
  const {
    register: registerEmployee,
    handleSubmit: handleSubmitEmployee,
    formState: { errors: employeeErrors, isSubmitting: employeeSubmitting },
  } = useForm<EmployeeLoginData>({
    resolver: yupResolver(employeeLoginSchema),
  });

  const onTabChange = (value: string) => setActiveTab(value);

  const onAdminSubmit = async (data: AdminLoginData) => {
    setErrorMsg("");
    // NextAuth expects credentials matching your `CredentialsProvider`
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      role: "admin",
      redirect: false,
    });
    console.log(res);
    if (res?.error) return setErrorMsg(res.error || "Invalid Credentials");
    router.push(callbackUrl || "/organization/dashboard");
  };

  const onEmployeeSubmit = async (data: EmployeeLoginData) => {
    setErrorMsg("");

    const res = await signIn("credentials", {
      email: data.email,
      password: data.orgPasscode,
      employeeId: data.employeeId,
      role: "employee",
    });

    console.log(res);
  };

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardContent className="p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Login to your account
        </h2>
        {errorMsg && <SignInError error={errorMsg as keyof Errors} />}

        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="employee">Employee</TabsTrigger>
          </TabsList>

          {/* Admin Login Form */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Please enter your admin credentials to access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <form
                  onSubmit={handleSubmitAdmin(onAdminSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input placeholder="Email" {...registerAdmin("email")} />
                    <p className="text-sm text-red-500">
                      {adminErrors.email?.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <PasswordInput
                      placeholder="Password"
                      {...registerAdmin("password")}
                    />
                    <p className="text-sm text-red-500">
                      {adminErrors.password?.message}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={adminSubmitting}
                  >
                    {adminSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    {adminSubmitting ? "Logging in..." : "Login as Admin"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employee Login Form */}
          <TabsContent value="employee">
            <Card>
              <CardHeader>
                <CardTitle>Employee</CardTitle>
                <CardDescription>
                  Please enter your employee credentials to access your
                  dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <form
                  onSubmit={handleSubmitEmployee(onEmployeeSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input placeholder="Email" {...registerEmployee("email")} />
                    <p className="text-sm text-red-500">
                      {employeeErrors.email?.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <Input
                      placeholder="Employee ID"
                      {...registerEmployee("employeeId")}
                    />
                    <p className="text-sm text-red-500">
                      {employeeErrors.employeeId?.message}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Organization Passcode</Label>
                    <PasswordInput
                      placeholder="Organization Passcode"
                      {...registerEmployee("orgPasscode")}
                    />
                    <p className="text-sm text-red-500">
                      {employeeErrors.orgPasscode?.message}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={employeeSubmitting}
                  >
                    {employeeSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    {employeeSubmitting ? "Logging in..." : "Login as Employee"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {activeTab === "admin" && (
          <p className="text-center text-sm">
            Dont have an organization?{" "}
            <Link href="/auth/register" className="text-primary underline">
              Register one
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
