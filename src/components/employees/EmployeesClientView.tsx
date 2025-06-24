"use client";

import { useEffect, useState } from "react";
// import { LayoutGrid, List } from "lucide-react";
// import axios from "axios";
import { ToggleView } from "../shared/toggle-view";
import { EmployeeCard } from "./EmployeeCard";
import { EmployeeTable } from "./EmployeeTable";
import { AddEmployeeModal } from "./AddEmployeeModal";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  isActive: boolean;
  departments: string[];
}

export function EmployeesClientView({ employees }: { employees: Employee[] }) {
  const [view, setView] = useState<"card" | "table">("card");
  //   const [employees, setEmployees] = useState<Employee[]>([]);
  //   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("employee-view");
    if (saved === "table" || saved === "card") setView(saved);
  }, []);

  const handleToggle = (mode: "card" | "table") => {
    setView(mode);
    localStorage.setItem("employee-view", mode);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <div className="flex items-center gap-3">
          <ToggleView view={view} onChange={handleToggle} />
          <AddEmployeeModal />
        </div>
      </div>

      {employees.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">
          No employees found.
        </p>
      ) : view === "card" ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {employees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </div>
      ) : (
        <EmployeeTable employees={employees} />
      )}
    </div>
  );
}
