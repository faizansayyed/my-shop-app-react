import { useEffect } from "react";

import { useAppDispatch } from "../store/hooks";
import { fetchCurrentUser } from "../store/authSlice";

export function useSessionRevalidation() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        dispatch(fetchCurrentUser());
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch]);
}
