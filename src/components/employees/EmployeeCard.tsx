import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Props {
  employee: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    departments: string[];
  };
}

export function EmployeeCard({ employee }: Props) {
  return (
    <Card>
      <CardContent className="pt-4 pb-6 space-y-1 relative">
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href={`/organization/employees/${employee.id}`}>
                <DropdownMenuItem>Manage</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Disable</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="font-semibold text-lg">{employee.name}</h3>
        <p className="text-sm text-muted-foreground">{employee.email}</p>
        <div className="text-xs text-muted-foreground flex gap-2 flex-wrap">
          {employee.departments.map((d) => (
            <Badge key={d} variant="outline">
              {d}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
