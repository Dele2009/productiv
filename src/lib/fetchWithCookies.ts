// lib/fetchWithCookies.ts
import { cookies } from "next/headers";

export async function fetchWithCookies(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return fetch(`${process.env.NEXT_PUBLIC_API_BASE}${input}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Cookie: cookieHeader,
    },
    credentials: "include", // Optional, if using same-site cookies
  });
}
