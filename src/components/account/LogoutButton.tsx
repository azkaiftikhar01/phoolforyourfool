"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  return (
    <button
      type="button"
      onClick={async () => {
        await logout();
        router.push("/");
        router.refresh();
      }}
      className="btn-secondary"
    >
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
