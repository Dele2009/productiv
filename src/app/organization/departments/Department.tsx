"use client";

import { useState, useEffect } from "react";
import { DepartmentCard } from "../components/DepartmentCard";
import { DepartmentTable } from "../components/DepartmentTable";
import { DepartmentFormModal } from "../components/DepartmentFormModal";
import { useRouter } from "next/navigation";
import { ToggleView } from "@/components/shared/toggle-view";

export interface Department {
  id: string;
  name: string;
  description: string;
  status: "active" | "suspended";
  createdAt: string;
  employeeCount: number;
}

type ViewMode = "card" | "table";

interface Props {
  departments: Department[];
}

export default function DepartmentClient({ departments }: Props) {
  const [view, setView] = useState<ViewMode>("card");
  const router = useRouter();
  // const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("department-view");
    if (saved === "table" || saved === "card") setView(saved);
  }, []);

  const toggleView = (mode: ViewMode) => {
    setView(mode);
    localStorage.setItem("department-view", mode);
  };

  const onDepartmentCreated = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Departments</h2>
        <div className="flex gap-2 items-center">
          <ToggleView view={view} onChange={toggleView}/>
          {/* <Button onClick={() => setShowModal(true)}>
            <Plus className="w-5 h-5 mr-1" /> New Department
          </Button> */}
          <DepartmentFormModal onDepartmentCreated={onDepartmentCreated} />
        </div>
      </div>

      {departments.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No departments found.
        </div>
      ) : view === "card" ? (
        <DepartmentCard departments={departments} />
      ) : (
        <DepartmentTable departments={departments} />
      )}
    </div>
  );
}
