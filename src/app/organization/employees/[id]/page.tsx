// app/(dashboard)/organization/employees/[id]/page.tsx

import { EmployeeDetailsShell } from "@/components/employees/EmployeeDetailsPage";
import { fetchWithCookies } from "@/lib/fetchWithCookies";
import { notFound } from "next/navigation";


export default async function EmployeeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;
  const res = await fetchWithCookies(`/api/organization/employees/${id}`)
  if (!res.ok) {
    if (res.status === 404) {
      return notFound();
    }
    throw new Error("Failed to fetch employee details");
  }
  const employee = await res.json();
  if (!employee) return notFound();

  return <EmployeeDetailsShell employee={employee} />;
}
