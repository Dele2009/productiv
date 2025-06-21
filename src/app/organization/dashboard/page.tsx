import DashBoard from "@/app/organization/components/dashboard";
import { fetchWithCookies } from "@/lib/fetchWithCookies";

export default async function OwnerDashboardPage() {
  const res = await fetchWithCookies(
    `/api/organization/stats`,
    { cache: "no-cache", credentials: "include" }
  );

  const data = await res.json();
  return <DashBoard data={data} />;
}