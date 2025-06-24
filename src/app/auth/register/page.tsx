"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterOwnerData, registerOwnerSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/passwordinput";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<RegisterOwnerData>({
    resolver: yupResolver(registerOwnerSchema),
  });

  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: RegisterOwnerData) => {
    setErrorMsg("");
    try {
      console.log(data);
      const response = await axios.post("/api/auth/register", data);
      toast(response.data.message, {
        description: "Check Your email to verify this account.",
        position: "top-center",
      });
      reset();
      router.push("/auth/register/success");
    } catch (err: any) {
      console.error("Registration error:", err.response);
      setErrorMsg(
        (err as any)?.response?.data?.error ||
          "An error occurred during registration."
      );
    }
  };

  return (
    <Card className=" w-full max-w-3xl shadow-2xl m-auto">
      <CardContent className="p-8 space-y-8">
        <h2 className="text-3xl font-semibold text-center">
          Register Organization Account
        </h2>
        {errorMsg && (
          <Alert variant="destructive">
            <CheckCircle2Icon />
            <AlertTitle>Registration failed.</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Owner Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label>Name</Label>
                <Input placeholder="Full name" {...register("name")} />
                <p className="text-sm text-red-500">{errors.name?.message}</p>
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label>Email</Label>
                <Input placeholder="Email" {...register("email")} />
                <p className="text-sm text-red-500">{errors.email?.message}</p>
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label>Password</Label>
                <PasswordInput
                  placeholder="Password"
                  {...register("password")}
                />
                <p className="text-sm text-red-500">
                  {errors.password?.message}
                </p>
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label>Confirm Password</Label>
                <PasswordInput
                  placeholder="Password"
                  {...register("c_password")}
                />
                <p className="text-sm text-red-500">
                  {errors.c_password?.message}
                </p>
              </div>
            </div>
          </div>

          {/* Org Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Organization Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label>Organization Name</Label>
                <Input
                  placeholder="Organization name"
                  {...register("organizationName")}
                />
                <p className="text-sm text-red-500">
                  {errors.organizationName?.message}
                </p>
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label>Organization Type</Label>
                <Select
                  value={watch("organizationType")}
                  onValueChange={(val) => setValue("organizationType", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-red-500">
                  {errors.organizationType?.message}
                </p>
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label>Industry</Label>
                <Select
                  value={watch("industry")}
                  onValueChange={(val) => setValue("industry", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-red-500">
                  {errors.industry?.message}
                </p>
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label>Organization Size</Label>
                <Select
                  value={watch("size")}
                  onValueChange={(val) => setValue("size", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">1–10</SelectItem>
                    <SelectItem value="medium">11–100</SelectItem>
                    <SelectItem value="large">100+</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-red-500">{errors.size?.message}</p>
              </div>
              <div className="grid w-full md:col-span-2 items-center gap-3">
                <Label>Country</Label>
                <Input
                  placeholder="Country"
                  {...register("country")}
                  className="w-full"
                />
                <p className="text-sm text-red-500">
                  {errors.country?.message}
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Registering..." : "Register Organization"}
          </Button>
        </form>
        <p className="text-center text-sm">
          Already have or belong to an organization?{" "}
          <Link href="/auth/login" className="text-primary underline">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
