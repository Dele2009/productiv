export interface UserType {
  id?: string;
  organizationId: string;
  name?: string;
  email: string;
  password: string; // hashed
  role?: "admin" | "member";
}
