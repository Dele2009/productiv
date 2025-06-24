"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UsersRound, UserX } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddDepartmentMemberModal } from "./AddDepartmentMemberModal";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  departmentId: string;
  users: User[];
}

export function DepartmentMembers({ departmentId, users }: Props) {
  const [members, setMembers] = useState<User[]>(users);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleRemove = async () => {
    if (!selectedUser) return;
    try {
      const res = await axios.delete(
        `/api/organization/departments/${departmentId}/employees/${selectedUser.id}`,
        { withCredentials: true }
      );
      console.log(res)
    } catch (err: any) {
      console.log(err)
    }
  };

  const handleAdded = (newUsers: User[]) => {
    setMembers((prev) => [...prev, ...newUsers]);
  };

  const filtered = members.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UsersRound className="w-5 h-5" /> Members
        </h2>
        <AddDepartmentMemberModal
          departmentId={departmentId}
          onAdded={handleAdded}
        />
      </div>

      <Input
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Image
            src="/assets/empty-team.svg"
            alt="No members"
            width={160}
            height={160}
            className="mx-auto mb-4"
          />
          <p className="text-sm">No members in this department yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((user) => (
            <Card key={user.id} className="relative">
              <CardContent className="pt-4 pb-6 space-y-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setOpenDialog(true);
                  }}
                  className="absolute top-2 right-2"
                >
                  <UserX className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <strong>{selectedUser?.name}</strong> from this department?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-4">
            <Image
              src="/illustrations/remove-user.svg"
              alt="Remove confirmation"
              width={120}
              height={120}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Confirm Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
