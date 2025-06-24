"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Loader2, UserPlus } from "lucide-react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  departmentId: string;
  onAdded: (users: User[]) => void;
}

export function AddDepartmentMemberModal({ departmentId, onAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    axios
      .get(`/api/organization/employees?excludeDepartment=${departmentId}`, {
        withCredentials: true,
      })
      .then((res) => setAllUsers(res.data))
      .finally(() => setLoading(false));
  }, [open, departmentId]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `/api/organization/departments/${departmentId}/employees`,
        { userIds: ids },
        { withCredentials: true }
      );
      console.log(res);
      const addedUsers = allUsers.filter((u) => ids.includes(u.id));
      onAdded(addedUsers);
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      alert("Failed to add users");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Members</DialogTitle>
          <DialogDescription>
            Choose users to add to this department.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            <Image
              src="/assets/empty-team.svg"
              alt="No users"
              width={140}
              height={140}
              className="mx-auto mb-4"
            />
            <p>No matching users found</p>
          </div>
        ) : (
          <ScrollArea className="h-64 pr-4">
            <ul className="space-y-2">
              {filtered.map((user) => (
                <li key={user.id} className="flex items-center gap-3">
                  <Checkbox
                    checked={selected.has(user.id)}
                    onCheckedChange={() => toggleSelect(user.id)}
                  />
                  <div>
                    <p className="font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}

        <DialogFooter className="pt-4">
          <Button
            disabled={isSubmitting}
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
            Add Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
