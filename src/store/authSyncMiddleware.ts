import type { AnyAction, Middleware } from "@reduxjs/toolkit";

import { fetchCurrentUser, sessionCleared } from "./authSlice";

const CHANNEL_NAME = "mini-shop-auth";
const FALLBACK_KEY = "mini-shop-auth-event";

type AuthEvent = {
  kind: "login" | "logout";
  // Distinguishes our own echo from a real cross-tab message.
  sentAt: number;
};

const authChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel(CHANNEL_NAME)
    : null;

function broadcast(event: AuthEvent) {
  if (authChannel) {
    authChannel.postMessage(event);
    return;
  }

  // Fallback for browsers without BroadcastChannel.
  // Writing to localStorage fires a "storage" event in OTHER tabs only.
  try {
    window.localStorage.setItem(FALLBACK_KEY, JSON.stringify(event));
  } catch {
    // Storage can be blocked in private mode. Sync is
    // a nice-to-have, so failing silently is acceptable.
  }
}

/**
 * Watches for successful login and logout in THIS tab
 * and tells the other tabs to re-check their session.
 */
export const authSyncMiddleware: Middleware =
  () => (next) => (action: unknown) => {
    const result = next(action);

    const typedAction = action as AnyAction;

    if (typedAction.type === "auth/login/fulfilled") {
      broadcast({ kind: "login", sentAt: Date.now() });
    }

    if (typedAction.type === "auth/logout/fulfilled") {
      broadcast({ kind: "logout", sentAt: Date.now() });
    }

    return result;
  };

export function subscribeToAuthEvents(dispatch: (action: unknown) => unknown) {
  function applyEvent(event: AuthEvent) {
    if (event.kind === "logout") {
      // Trust it immediately. ProtectedRoute will then
      // redirect this tab to /login on the next render.
      dispatch(sessionCleared());
      return;
    }

    // For login we do NOT trust the message blindly.
    // We re-verify against /auth/me so this tab only
    // becomes authenticated if the cookie is genuinely valid.
    dispatch(fetchCurrentUser());
  }

  function handleChannelMessage(event: MessageEvent<AuthEvent>) {
    if (!event.data?.kind) return;
    applyEvent(event.data);
  }

  function handleStorageEvent(event: StorageEvent) {
    if (event.key !== FALLBACK_KEY || !event.newValue) return;

    try {
      applyEvent(JSON.parse(event.newValue) as AuthEvent);
    } catch {
      // Ignore malformed payloads.
    }
  }

  authChannel?.addEventListener("message", handleChannelMessage);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    authChannel?.removeEventListener("message", handleChannelMessage);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
