import type { Middleware, UnknownAction } from "@reduxjs/toolkit";

const CHANNEL_NAME = "mini-shop-cart";

const cartChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel(CHANNEL_NAME)
    : null;

type CartSyncAction = UnknownAction & {
  meta?: Record<string, unknown>;
};

function isCartSyncAction(action: unknown): action is CartSyncAction {
  return (
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof action.type === "string" &&
    action.type.startsWith("cart/")
  );
}

export const cartSyncMiddleware: Middleware =
  () => (next) => (action: unknown) => {
    const result = next(action);

    if (!isCartSyncAction(action)) {
      return result;
    }

    const cameFromAnotherTab = action.meta?.fromAnotherTab === true;

    if (cartChannel && !cameFromAnotherTab) {
      cartChannel.postMessage(action);
    }

    return result;
  };

export function subscribeToCartChanges(
  dispatch: (action: UnknownAction) => void,
) {
  if (!cartChannel) {
    return () => {};
  }

  function handleMessage(event: MessageEvent<unknown>) {
    const receivedAction = event.data;

    if (!isCartSyncAction(receivedAction)) {
      return;
    }

    dispatch({
      ...receivedAction,
      meta: {
        ...receivedAction.meta,
        fromAnotherTab: true,
      },
    });
  }

  cartChannel.addEventListener("message", handleMessage);

  return () => {
    cartChannel.removeEventListener("message", handleMessage);
  };
}
