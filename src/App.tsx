import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import AppShell from "./components/layout/AppShell";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import NotFoundPage from "./pages/NotFoundPage";

import { useAppDispatch } from "./store/hooks";
import { fetchCurrentUser } from "./store/authSlice";
import LoginPage from "./pages/LoginPage";
import { useSessionRevalidation } from "./hooks/useSessionRevalidation";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useSessionRevalidation();

  return (
    <AppShell>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* Guests only */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Logged in only */}
        <Route element={<ProtectedRoute requireAdmin={false} />}>
          <Route path="/products" element={<ProductsPage />} />
        </Route>

        {/* Admin only - for later pages like /products/new */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<p>Admin area</p>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
