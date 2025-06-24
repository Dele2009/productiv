import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/themetoggler";
import { auth } from "@/auth";
import Logo from "@/components/logo";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-6 py-10 flex flex-col justify-between">
      {/* Header */}
      <header className="flex justify-between items-center w-full max-w-6xl mx-auto">
        <Logo />{" "}
        <nav className="flex justify-center align-center gap-4">
          {!session ? (
            <>
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </>
          ) : (
            <Link href="/organization/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </header>
      {children}
      {/* Footer */}
      <footer className="text-center text-sm text-zinc-500 mt-20">
        &copy; {new Date().getFullYear()} Productiv Inc. All rights reserved.
      </footer>
    </main>
  );
}
