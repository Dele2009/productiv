// lib/validations/department.ts
import * as yup from "yup";

export const createDepartmentSchema = yup.object({
  name: yup.string().required("Department name is required"),
  description: yup.string().required("Department description is required"),
  status: yup.string().default("active"),
});
export type CreateDepartmentSchema = yup.InferType<typeof createDepartmentSchema>


export const createTaskSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  dueDate: yup.date().nullable(),
});
export type CreateTaskSchema = yup.InferType<typeof createTaskSchema>


export const addUserToDepartment = yup.object({
  userIds: yup.array(yup.string()).min(1, "Provide at least one to add")
})
export type AddUserToDepartment = yup.InferType<typeof addUserToDepartment>;



export const addEmployeeSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
  .string()
  .email("Enter a valid email")
  .required("Email is required"),
  role: yup.string().oneOf(["member", "admin"]).required("Role is required"),
});
export type AddEmployeeSchema = yup.InferType<typeof addEmployeeSchema>;