import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import api from "../services/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token) => {
        set({ user, accessToken: token, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Logout failed", error);
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        const { accessToken } = get();
        if (!accessToken) {
            set({ isAuthenticated: false, user: null });
            return;
        }
        set({ isLoading: true });
        try {
          const response = await api.get("/auth/me");
          set({ user: response.data.data.user, isAuthenticated: true });
        } catch (error) {
          // Error interceptor will handle token refresh, if it fails completely it will clear state
          set({ isAuthenticated: false, user: null, accessToken: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ accessToken: state.accessToken, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
