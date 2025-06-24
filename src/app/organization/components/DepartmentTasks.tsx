"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Trash2 } from "lucide-react";
import Image from "next/image";
import { CreateTaskModal } from "@/components/create-task-modal";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  dueDate?: string;
}

interface Props {
  departmentId: string;
}

export function DepartmentTasks({ departmentId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/organization/departments/${departmentId}/tasks`)
      .then((res) => {
        console.log(res)
        setTasks(res.data)
      })
      .finally(() => setLoading(false));
  }, [departmentId]);

  const handleDelete = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ClipboardList className="w-5 h-5" /> Tasks
        </h2>
        <CreateTaskModal departmentId={departmentId} onCreated={() => {}} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))} 
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Image
            src="/assets/no-tasks.svg"
            alt="No tasks"
            width={160}
            height={160}
            className="mx-auto mb-4"
          />
          <p className="text-sm">No tasks found for this department.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="pt-4 pb-6 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Status: {task.status}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
