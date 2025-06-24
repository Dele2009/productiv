"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditEmployeeModal } from "./EditEmployeeModal";
import { EmployeeProfileTab } from "./EmployeeProfileTab";
import { EmployeeDepartmentsTab } from "./EmployeeDepartmentsTab";
import { EmployeeTasksTab } from "./EmployeeTaskTab";
import { Button } from "../ui/button";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

export function EmployeeDetailsShell({ employee }: { employee: any }) {
  return (
    <div className="space-y-6">
      <Link href="/organization/employees">
        <Button variant="outline" className="group flex items-center transition-all">
          <ArrowBigLeft className="h-5 w-5" />
          <span className="ml-2 max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:opacity-100">
            Back
          </span>
        </Button>
      </Link>
      <div className="flex items-center justify-between mt-3">
        <div>
          <h1 className="text-2xl font-bold">{employee.name}</h1>
          <p className="text-sm text-muted-foreground">{employee.email}</p>
        </div>
        <EditEmployeeModal employee={employee} />
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <EmployeeProfileTab employee={employee} />
        </TabsContent>
        <TabsContent value="departments">
          <EmployeeDepartmentsTab employeeId={employee.id} />
        </TabsContent>
        <TabsContent value="tasks">
          <EmployeeTasksTab employeeId={employee.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
