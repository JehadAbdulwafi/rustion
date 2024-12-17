"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-screen gap-4 w-full items-center justify-center px-4">
      <Link href="/dashboard">
        <Button>Dashboard</Button>
      </Link>
      <Link href="/auth">
        <Button>Login</Button>
      </Link>
    </div>
  )
}

