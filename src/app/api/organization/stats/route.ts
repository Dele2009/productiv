export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Op } from "sequelize";
import { User, Task, Department } from "@/server/models";
import {
  HandlerArgs,
  withValidationAndRole,
} from "@/server/utils/withValidateAndRole";

const handleGet = async ({ user }: HandlerArgs) => {
  const OrganizationId = user.organization.id;

  // KPI Stats
  const departmentsCount = await Department.count({
    where: { OrganizationId },
  });
  const membersCount = await User.count({
    where: { organizationId: OrganizationId },
  });
  const openTasksCount = await Task.count({
    where: { OrganizationId, status: "todo" },
  });
  const closedTasksCount = await Task.count({
    where: { OrganizationId, status: "done" },
  });
  const activityLogsCount = 10; // Replace with actual activity logs count when available

  // Departments with member count and open tasks
  const departments = await Department.findAll({
    where: { OrganizationId },
    include: [
      {
        model: User,
        through: { attributes: [] },
      },
      {
        model: Task,
        where: { status: "todo" },
        required: false,
      },
    ],
  });

  const departmentData = departments.map((dept: any) => ({
    id: dept.id,
    name: dept.name,
    members: dept.Users?.length || 0,
    tasksOpen: dept.Tasks?.length || 0,
  }));

  // Recent activity dummy placeholder
  const activity = [
    { id: 1, action: "Added a new department", time: "2025-06-15 10:04" },
    {
      id: 2,
      action: "Assigned task to a team member",
      time: "2025-06-15 09:42",
    },
    { id: 3, action: "Closed a task", time: "2025-06-15 09:10" },
    { id: 4, action: "Removed a department", time: "2025-06-15 08:55" },
  ];

  // Chart data (created and completed tasks per day for past 6 days)
  const today = new Date();
  const dates = [...Array(6)].map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (5 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = await Promise.all(
    dates.map(async (date) => {
      const created = await Task.count({
        where: {
          OrganizationId,
          createdAt: {
            [Op.between]: [
              new Date(`${date}T00:00:00`),
              new Date(`${date}T23:59:59`),
            ],
          },
        },
      });
      const completed = await Task.count({
        where: {
          OrganizationId,
          status: "done",
          updatedAt: {
            [Op.between]: [
              new Date(`${date}T00:00:00`),
              new Date(`${date}T23:59:59`),
            ],
          },
        },
      });

      return { date, created, completed };
    })
  );

  return NextResponse.json({
    kpis: [
      { label: "Departments", value: departmentsCount },
      { label: "Members", value: membersCount },
      { label: "Open Tasks", value: openTasksCount },
      { label: "Closed Tasks", value: closedTasksCount },
      { label: "Activity Logs", value: activityLogsCount },
    ],
    departments: departmentData,
    activity,
    chartData,
  });
};

export const GET = withValidationAndRole(["admin"], handleGet);
