import type { RootState } from "./store";

export const selectUser = (state: RootState) => state.auth.user;

export const selectAuthStatus = (state: RootState) => state.auth.status;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.status === "authenticated";

export const selectIsAdmin = (state: RootState) =>
  state.auth.user?.role === "admin";

export const selectAuthError = (state: RootState) => state.auth.error;

export const selectIsAuthSubmitting = (state: RootState) =>
  state.auth.isSubmitting;
