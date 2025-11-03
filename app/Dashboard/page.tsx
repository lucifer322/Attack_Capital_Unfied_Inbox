"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InboxLayout from "@/app/Dashboard/Components/InboxLayout";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p className="text-center mt-10">Loading session...</p>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-semibold text-gray-800">
          Unified Inbox 📬
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{session?.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Inbox */}
      <main className="flex-1 overflow-hidden">
        <InboxLayout />
      </main>
    </div>
  );
}
