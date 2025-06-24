// app/(dashboard)/employees/page.tsx

import { EmployeesClientView } from "@/components/employees/EmployeesClientView";
import { fetchWithCookies } from "@/lib/fetchWithCookies";
import { notFound } from "next/navigation";

export default async function EmployeesPage() {
  const res = await fetchWithCookies("/api/organization/employees?format=true");
  if (!res.ok) {
    notFound();
  }
  const employees = await res.json();
  return <EmployeesClientView employees={employees} />;
}
