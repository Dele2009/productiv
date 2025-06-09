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

type AdminLoginData = yup.InferType<typeof adminLoginSchema>;
type EmployeeLoginData = yup.InferType<typeof employeeLoginSchema>;

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState("");
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
    try {
      console.log("Admin login data:", data);
      // TODO: call your admin login API here
    } catch (err: unknown) {
      setErrorMsg("Admin login failed.");
    }
  };

  const onEmployeeSubmit = async (data: EmployeeLoginData) => {
    setErrorMsg("");
    try {
      console.log("Employee login data:", data);
      // TODO: call your employee login API here
    } catch (err: unknown) {
      setErrorMsg("Employee login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">
            Login to your account
          </h2>
          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

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
                    Please enter your admin credentials to access your
                    dashboard.
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
                      <Input
                        type="password"
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
                      <Input
                        placeholder="Email"
                        {...registerEmployee("email")}
                      />
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
                      <Input
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
                      {employeeSubmitting
                        ? "Logging in..."
                        : "Login as Employee"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
