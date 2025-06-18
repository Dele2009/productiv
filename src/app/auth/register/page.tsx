"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterOwnerData, registerOwnerSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";

export default function RegisterPage() {
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

  // const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: RegisterOwnerData) => {
    // setErrorMsg("");
    try {
      console.log(data);
      const response = await axios.post("/api/auth/register", data);
      toast(response.data.message, {
        description: "Check Your email to verify this account.",
        position: "top-center",
      });
      reset();
      // TODO: POST to /api/auth/register
    } catch (err: any) {
      console.error("Registration error:", err.response);
      toast("Registration failed.", {
        description:
          (err as any)?.response?.data?.error ||
          "An error occurred during registration.",
        position: "top-center",
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl shadow-2xl m-auto">
      <CardContent className="p-8 space-y-8">
        <h2 className="text-3xl font-semibold text-center">
          Register Organization Account
        </h2>

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
                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                />
                <p className="text-sm text-red-500">
                  {errors.password?.message}
                </p>
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
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
              <div className="grid w-full max-w-sm md:col-span-2 items-center gap-3">
                <Label>Country</Label>
                <Input placeholder="Country" {...register("country")} />
                <p className="text-sm text-red-500">
                  {errors.country?.message}
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register Organization"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
