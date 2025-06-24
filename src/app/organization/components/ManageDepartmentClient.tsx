"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepartmentTasks } from "./DepartmentTasks";
import { Users, ClipboardList } from "lucide-react";
import { useState } from "react";
import { DepartmentMembers } from "./DepartmentMembers";

interface Props {
  departmentId: string;
  departmentName: string;
  users: { id: string; name: string; email: string }[];
}

export function ManageDepartmentClient({
  departmentId,
//   departmentName,
  users,
}: Props) {
  const [activeTab, setActiveTab] = useState("members");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full space-y-6"
    >
      <TabsList className="gap-2">
        <TabsTrigger value="members">
          <Users className="w-4 h-4 mr-2" /> Members
        </TabsTrigger>
        <TabsTrigger value="tasks">
          <ClipboardList className="w-4 h-4 mr-2" /> Tasks
        </TabsTrigger>
      </TabsList>

      <TabsContent value="members">
        <DepartmentMembers departmentId={departmentId} users={users} />
      </TabsContent>

      <TabsContent value="tasks">
        <DepartmentTasks departmentId={departmentId} />
      </TabsContent>
    </Tabs>
  );
}
