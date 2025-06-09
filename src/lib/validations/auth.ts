import * as yup from "yup";

export const registerOwnerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
  c_password: yup.string().required("Confirm Password is required").oneOf([yup.ref("password")], "Passwords must match"),
  // Organization Info

  organizationName: yup.string().required("Organization name is required"),
  organizationType: yup.string().required("Type is required"),
  industry: yup.string().required("Industry is required"),
  size: yup.string().required("Size is required"),
  country: yup.string().required("Country is required"),
});

export type RegisterOwnerData = yup.InferType<typeof registerOwnerSchema>;
