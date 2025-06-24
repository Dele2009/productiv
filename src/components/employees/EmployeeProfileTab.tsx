"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmployeeProfileTab({ employee }: { employee: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{employee.name}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{employee.email}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Employee ID</p>
          <p className="font-medium">{employee.employeeId || "Not assigned"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Role</p>
          <Badge variant="outline" className="capitalize">
            {employee.role}
          </Badge>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge variant={employee.isActive ? "default" : "destructive"}>
            {employee.isActive ? "Active" : "Suspended"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
