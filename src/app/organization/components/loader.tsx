"use client";

import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

export default function Load({ children }: { children: React.ReactNode }) {
  const {status} = useSession()
  // const [showContent, setShowContent] = useState(false);
  // useEffect(() => {
  //   const id = setTimeout(() => setShowContent(true), 4000);
  //   return () => clearTimeout(id);
  // }, []);
  return (
    <>
      {status === "loading" ? (
        <div className="flex items-center justify-center min-h-screen">
          {/* Loading spinner */}
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-cyan-500"></div>
        </div>
      ) : (
        children
      )}
    </>
  );
}
