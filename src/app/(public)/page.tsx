// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <section className="flex flex-col items-center text-center mt-24 max-w-4xl mx-auto">
      <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
        Streamline Your Team&#39;s Productivity
      </h2>
      <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mb-6">
        Productiv helps organizations manage departments, assign tasks, and stay
        on top of team progress — all in one secure and modern platform.
      </p>
      {!session && (
        <div className="space-x-4">
          <Link href="/auth/register">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      )}
    </section>
  );
}
