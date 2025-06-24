"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Trash2,
  ShieldCheck,
  Users,
  CalendarClock,
} from "lucide-react";
import { Department } from "../departments/Department";
import Link from "next/link";

interface Props {
  departments: Department[];
}

export const DepartmentTable = ({ departments }: Props) => {
  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell>
                <div className="font-medium">{dept.name}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {dept.description || "No description provided."}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={dept.status === "active" ? "default" : "secondary"}
                  className={
                    dept.status === "suspended"
                      ? "bg-yellow-400 text-black"
                      : ""
                  }
                >
                  {dept.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {dept.employeeCount}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarClock className="w-4 h-4" />
                  {new Date(dept.createdAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                  <Link href={`/organization/departments/${dept.id}/manage`}>
                <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-1" /> Manage{" "}
                </Button>
                  </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert(`Toggle suspend for ${dept.name}`)}
                >
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  {dept.status === "active" ? "Suspend" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    confirm(`Delete ${dept.name}?`) &&
                    alert(`Deleted ${dept.name}`)
                  }
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
