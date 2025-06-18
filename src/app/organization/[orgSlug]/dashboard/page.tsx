import DashBoard from "@/app/organization/components/dashboard";

export default async function OwnerDashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/organization/${orgSlug}/stats`,
    { cache: "no-cache" }
  );

  const data = await res.json();
  return <DashBoard data={data} />;
}