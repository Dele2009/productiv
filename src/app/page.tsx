// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-6 py-10 flex flex-col justify-between">
      {/* Header */}
      <header className="flex justify-between items-center w-full max-w-6xl mx-auto">
        <img src="/logo.png" alt="logo" className="h-32"/>
        <nav className="space-x-4">
          <Link href="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center mt-24 max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Streamline Your Team&#39;s Productivity
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mb-6">
          Productiv helps organizations manage departments, assign tasks, and stay on top of team progress — all in one secure and modern platform.
        </p>
        <div className="space-x-4">
          <Link href="/auth/register">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-zinc-500 mt-20">
        &copy; {new Date().getFullYear()} Productiv Inc. All rights reserved.
      </footer>
    </main>
  );
}
