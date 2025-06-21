import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo({
  width = 190,
  href = "/",
}: {
  width?: number | string | undefined;
  href?: string;
}) {
  return (
    <Link href={href}>
      <Image
        src="/logo.png"
        className="!block dark:!hidden"
        alt="logo-light"
        width={width as number}
        height={80}
      />
      <Image
        src="/logo-white.png"
        className="!hidden dark:!block"
        alt="logo-dark"
        width={width as number}
        height={80}
      />
    </Link>
  );
}
export default Logo;
