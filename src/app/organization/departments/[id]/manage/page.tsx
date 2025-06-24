// app/dashboard/departments/[id]/manage/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { Department, User } from "@/server/models";
import { ManageDepartmentClient } from "@/app/organization/components/ManageDepartmentClient";
import { initDB } from "@/server/config/db";

export default async function ManageDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = (await auth())?.user;
  if (!user) return notFound();
  const { id } = await params;
  await initDB();
  const department: any = await Department.findOne({
    where: {
      id,
      OrganizationId: user.organization.id,
    },
    include: [
      {
        model: User,
        through: { attributes: [] },
      },
    ],
  });

  if (!department) return notFound();

  return (
    <div className="px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Department</h1>
          <p className="text-muted-foreground">
            Update members and tasks for: <strong>{department.name}</strong>
          </p>
        </div>
        <Image
          src="/assets/manage.svg"
          alt="Department illustration"
          width={120}
          height={120}
          className="hidden md:block"
        />
      </div>

      <ManageDepartmentClient
        departmentId={department.id}
        departmentName={department.name}
        users={department.Users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
        }))}
      />
    </div>
  );
}
