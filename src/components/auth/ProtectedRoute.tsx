import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectAuthStatus, selectIsAdmin } from "../../store/authSelectors";
import { useAppSelector } from "../../store/hooks";

type ProtectedRouteProps = {
  requireAdmin: boolean;
};

export default function ProtectedRoute({
  requireAdmin = false,
}: ProtectedRouteProps) {
  const status = useAppSelector(selectAuthStatus);
  const isAdmin = useAppSelector(selectIsAdmin);
  const location = useLocation();

  if (status === "checking") {
    return <p className="route-loading">Checking session...</p>;
  }

  if (status === "guest") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
