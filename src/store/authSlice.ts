import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiRequest } from "../services/apiClient";

import type { AuthResponse, LoginInput, User } from "../types/auth";

type AuthState = {
  user: User | null;
  // "checking" is the state before /me resolves on first load.
  // Without it, protected routes would redirect logged in users.
  status: "checking" | "authenticated" | "guest";
  isSubmitting: boolean;
  error: string;
};

const initialState: AuthState = {
  user: null,
  status: "checking",
  isSubmitting: false,
  error: "",
};

export const login = createAsyncThunk<
  User,
  LoginInput,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const result = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: credentials,
    });

    return result.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Login failed",
    );
  }
});

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/me", async (_arg, { rejectWithValue }) => {
  try {
    const result = await apiRequest<AuthResponse>("/auth/me");
    return result.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Not authenticated",
    );
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await apiRequest("/auth/logout", { method: "POST" });
});

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isSubmitting = true;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(login.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || "Login failed";
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "checking";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.status = "guest";
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "guest";
        state.error = "";
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
