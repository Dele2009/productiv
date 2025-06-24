"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Users,
  CalendarDays,
  Trash2,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { Department } from "../departments/Department";
import Link from "next/link";

interface Props {
  departments: Department[];
}

export const DepartmentCard = ({ departments }: Props) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {departments.map((dept) => (
        <Card
          key={dept.id}
          className="relative group shadow-sm border hover:shadow-lg transition"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold">
                  {dept.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm line-clamp-2">
                  {dept.description || "No description provided."}
                </CardDescription>
              </div>
              {/* Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-muted-foreground hover:text-black">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/organization/departments/${dept.id}/manage`}>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" /> Manage
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={() => alert(`Toggling suspend for ${dept.name}`)}
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />{" "}
                    {dept.status === "active" ? "Suspend" : "Activate"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      confirm(`Delete ${dept.name}?`) &&
                      alert(`Deleted ${dept.name}`)
                    }
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" /> {dept.employeeCount} employees
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="w-4 h-4" />{" "}
              {new Date(dept.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
