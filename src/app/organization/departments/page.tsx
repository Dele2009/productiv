import { fetchWithCookies } from "@/lib/fetchWithCookies";
import DepartmentClient from "./Department";

interface Department {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'suspended';
  createdAt: string;
  employeeCount: number;
}

// Fetch directly or from a helper
async function getDepartments(): Promise<Department[]> {
  const res = await fetchWithCookies(
    `/api/organization/departments`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error('Failed to fetch departments');
  return res.json();
}

export default async function DepartmentPage() {
  const departments = await getDepartments();

  return (
    <div className="p-6">
      <DepartmentClient departments={departments} />
    </div>
  );
}
