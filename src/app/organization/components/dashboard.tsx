"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, Legend } from "recharts";
import {
  User,
  ListCheck,
  Activity as ActivityIcon,
  BarChart as BarChartIcon,
  Layers,
  BadgeCheck,
  FolderX,
  Ghost,
  BarChartBig,
} from "lucide-react";

type Department = {
  id: string;
  name: string;
  members: number;
  tasksOpen: number;
};

type Activity = {
  id: string;
  action: string;
  time: string;
};

type ChartDataPoint = {
  date: string;
  created: number;
  completed: number;
};

type KPI = { label: string; value: number };

type DashboardProps = {
  data: {
    kpis: KPI[];
    departments: Department[];
    activity: Activity[];
    chartData: ChartDataPoint[];
  };
};

export default function Dashboard({ data }: DashboardProps) {
  const [activeSeries, setActiveSeries] = useState<"created" | "completed">(
    "created"
  );

  const chartConfig = {
    created: { label: "Tasks Created", color: "#9333EA" },
    completed: { label: "Tasks Completed", color: "#06B6D4" },
  };

  const chartCount = data.chartData.reduce((arr, data) => {
    arr.completed = arr.completed + data.completed
    arr.created = arr.created + data.created;
    return arr
  }, {created: 0, completed: 0})

  return (
    <div className="p-6 space-y-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {data.kpis.length > 0 ? (
          data.kpis.map((item, i) => (
            <Card
              key={item.label}
              className="flex items-center p-6 space-x-4 shadow-lg border-black/20 transition transform hover:shadow-2xl hover:translate-y-[-4px] group"
              style={{
                borderLeft: `4px solid ${i % 2 === 0 ? "#9333EA" : "#06B6D4"}`,
              }}
            >
              <div
                className="p-4 rounded-full mr-4 flex items-center justify-center"
                style={{ background: i % 2 === 0 ? "#9333EA20" : "#06B6D420" }}
              >
                {item.label.toLowerCase().includes("tasks") && (
                  <ListCheck color="#9333EA" size={32} />
                )}
                {item.label.toLowerCase().includes("members") && (
                  <User color="#06B6D4" size={32} />
                )}
                {item.label.toLowerCase().includes("open") && (
                  <ActivityIcon color="#9333EA" size={32} />
                )}
                {item.label.toLowerCase().includes("completed") && (
                  <BadgeCheck color="#06B6D4" size={32} />
                )}
                {item.label.toLowerCase().includes("total") && (
                  <Layers color="#9333EA" size={32} />
                )}
              </div>

              <div>
                <p className="text-4xl font-semibold group-hover:text-cyan-500 transition">
                  {item.value}
                </p>
                <p className="text-gray-500 font-semibold">{item.label}</p>
              </div>
            </Card>
          ))
        ) : (
          <Card className="col-span-full flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <FolderX size={48} className="mb-4" />
            <p>No KPIs available yet.</p>
          </Card>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Departments Table */}
        <Card className="lg:col-span-2 shadow-lg border-black/20">
          <CardHeader className="flex items-center space-x-2">
            <ListCheck color="#9333EA" size={24} />
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent>
            {data.departments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Open Tasks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.departments.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.name}</TableCell>
                      <TableCell>{d.members}</TableCell>
                      <TableCell>{d.tasksOpen}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                <Ghost size={40} className="mb-2" />
                <p>No departments available.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="shadow-lg border-black/20">
          <CardHeader className="flex items-center space-x-2">
            <ActivityIcon color="#06B6D4" size={24} />
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {data.activity.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <ul className="space-y-4">
                  {data.activity.map((a) => (
                    <li
                      key={a.id}
                      className="p-4 border rounded shadow-md hover:shadow-lg transition"
                    >
                      <p>{a.action}</p>
                      <span className="text-gray-500 text-sm">{a.time}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                <ActivityIcon size={40} className="mb-2" />
                <p>No recent activities.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-lg border-black/20">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center space-x-2">
            <BarChartIcon color="#9333EA" size={24} />
            <CardTitle>Tasks Over Time</CardTitle>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            {(["created", "completed"] as const).map((series) => (
              <button
                key={series}
                onClick={() => setActiveSeries(series)}
                className={`px-4 py-1 rounded ${
                  activeSeries === series
                    ? "bg-black text-cyan-500 font-semibold"
                    : "bg-gray-200 text-black"
                } transition`}
              >
                {chartConfig[series].label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {chartCount[activeSeries] > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[200px]">
              <BarChart data={data.chartData}>
                <CartesianGrid vertical={false} stroke="#E5E5E5" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => new Date(d).toLocaleDateString()}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar
                  dataKey={activeSeries}
                  fill={chartConfig[activeSeries].color}
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center">
              <BarChartBig size={48} className="mb-4" />
              <p>No chart data to display yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
