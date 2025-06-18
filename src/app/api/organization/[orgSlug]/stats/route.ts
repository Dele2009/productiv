// const dummyData = {
//   kpis: [
//     { label: "Departments", value: 5 },
//     { label: "Members", value: 42 },
//     { label: "Open Tasks", value: 17 },
//     { label: "Closed Tasks", value: 23 },
//     { label: "Activity Logs", value: 10 },
//   ],
//   departments: [
//     { id: 1, name: "Engineering", members: 20, tasksOpen: 5 },
//     { id: 2, name: "Design", members: 10, tasksOpen: 2 },
//     { id: 3, name: "Marketing", members: 7, tasksOpen: 4 },
//     { id: 4, name: "Support", members: 5, tasksOpen: 6 },
//   ],
//   activity: [
//     { id: 1, action: "Added a new department", time: "2025-06-15 10:04" },
//     { id: 2, action: "Assigned task to a team member", time: "2025-06-15 09:42" },
//     { id: 3, action: "Closed a task", time: "2025-06-15 09:10" },
//     { id: 4, action: "Removed a department", time: "2025-06-15 08:55" },
//   ],
//   chartData: [
//     { date: "2025-06-10", created: 5, completed: 3 },
//     { date: "2025-06-11", created: 10, completed: 6 },
//     { date: "2025-06-12", created: 7, completed: 5 },
//     { date: "2025-06-13", created: 14, completed: 9 },
//     { date: "2025-06-14", created: 20, completed: 15 },
//     { date: "2025-06-15", created: 18, completed: 11 },
//   ],
// };

// app/api/organization/[slug]/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import { User, Organization, Task, Department } from "@/server/models";
import { initDB } from "@/server/config/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgSlug: string }> }
) {
  try {
    await initDB();
    const { orgSlug: slug } = await params;

    // Fetch organization
    const organization = await Organization.findOne({ where: { slug } });
    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const orgId = organization.id;

    // KPI Stats
    const departmentsCount = await Department.count({
      where: { organizationId: orgId },
    });
    const membersCount = await User.count({ where: { organizationId: orgId } });
    const openTasksCount = await Task.count({
      where: { organizationId: orgId, status: "open" },
    });
    const closedTasksCount = await Task.count({
      where: { organizationId: orgId, status: "closed" },
    });
    const activityLogsCount = 10; // Replace with actual activity logs count when available

    // Departments with member count and open tasks
    const departments = await Department.findAll({
      where: { organizationId: orgId },
      include: [
        {
          model: User,
          through: { attributes: [] },
        },
        {
          model: Task,
          where: { status: "open" },
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
            organizationId: orgId,
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
            organizationId: orgId,
            status: "closed",
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
