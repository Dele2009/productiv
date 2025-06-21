// lib/validations/department.ts
import * as yup from "yup";

export const createDepartmentSchema = yup.object({
  name: yup.string().required("Department name is required"),
  description: yup.string().required("Department description is required"),
  status: yup.string().default("active"),
});
export type CreateDepartmentSchema = yup.InferType<typeof createDepartmentSchema>
