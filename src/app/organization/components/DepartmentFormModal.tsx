"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CheckCircle2, Loader2, Plus, PlusCircle, ShieldAlert } from "lucide-react";
import Image from "next/image";
import {
  CreateDepartmentSchema,
  createDepartmentSchema,
} from "@/lib/validations/schema";
import axios from "axios";
import { toast } from "sonner";

interface Props {
  onDepartmentCreated?: () => void;
}

export function DepartmentFormModal({ onDepartmentCreated }: Props) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(createDepartmentSchema),
  });

  const onSubmit = async (data: CreateDepartmentSchema) => {
    try {
      await axios.post("/api/organization/departments", data, {
        withCredentials: true
      });
      reset();
      onDepartmentCreated?.();
      toast("Department Created Successfully", {
        icon: <CheckCircle2 className="text-primary" size={20}/>
      })
    } catch(err: any) {
      toast(err?.response?.data?.error || "Error Creating Department", {
        icon: <ShieldAlert className="text-[#ff0000]" size={20} />,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-5 h-5 mr-1" /> New Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            New Department
          </DialogTitle>
          <DialogDescription>
            Create a new department and begin assigning employees and tasks.
          </DialogDescription>
        </DialogHeader>

        {/* Illustration */}
        <div className="mb-4">
          <Image
            src="/assets/create-department.svg"
            alt="Department Illustration"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              placeholder="e.g. Engineering"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the department"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {isSubmitting ? "Creating..." : "Create Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
