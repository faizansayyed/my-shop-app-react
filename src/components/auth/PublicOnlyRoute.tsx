import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../../store/hooks";
import { selectAuthStatus } from "../../store/authSelectors";

/**
 * Keeps an already logged in user off /login.
 */
export default function PublicOnlyRoute() {
  const status = useAppSelector(selectAuthStatus);

  if (status === "checking") {
    return <p className="route-loading">Checking session...</p>;
  }

  if (status === "authenticated") {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
}
