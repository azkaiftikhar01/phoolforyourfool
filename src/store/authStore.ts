"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SessionUser } from "@/types";

interface AuthState {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        set({ user: null });
      },
      refresh: async () => {
        try {
          const res = await fetch("/api/auth/me");
          if (!res.ok) return;
          const data = (await res.json()) as { user: SessionUser | null };
          set({ user: data.user });
        } catch {
          /* ignore */
        }
      },
    }),
    {
      name: "pfyf-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
