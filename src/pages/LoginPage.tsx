import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import { clearAuthError, login } from "../store/authSlice";

import {
  selectAuthError,
  selectIsAuthSubmitting,
} from "../store/authSelectors";

import type { LoginInput } from "../types/auth";

const emptyForm: LoginInput = {
  email: "admin@minishop.com",
  password: "Password@123",
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const serverError = useAppSelector(selectAuthError);
  const isSubmitting = useAppSelector(selectIsAuthSubmitting);

  const [form, setForm] = useState<LoginInput>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginInput, string>>
  >({});

  // Clear any stale server error when leaving the page.
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  function updateField(field: keyof LoginInput, value: string) {
    // ✅ FIXED: use computed property name [field] instead of a literal "value"
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    // ✅ FIXED: use the actual field name to clear its error (set to empty string)
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "", // empty string → falsy, so the error won't be displayed
    }));
  }

  function validate() {
    const errors: Partial<Record<keyof LoginInput, string>> = {};

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(form.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    const result = await dispatch(
      login({
        email: form.email.trim(),
        password: form.password,
      }),
    );

    if (login.fulfilled.match(result)) {
      // ProtectedRoute stored where the user was headed.
      const redirectTo =
        (location.state as { from?: string })?.from || "/products";

      navigate(redirectTo, { replace: true });
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div>
          <h2>Sign in</h2>
          <p className="auth-card__subtitle">
            Use your Mini Shop account to continue.
          </p>
        </div>

        <form className="product-form" onSubmit={handleSubmit} noValidate>
          {serverError && (
            <p className="error-message" role="alert">
              {serverError}
            </p>
          )}

          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              aria-invalid={Boolean(fieldErrors.email)}
              onChange={(event) => updateField("email", event.target.value)}
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </label>

          <label>
            Password
            <span className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                aria-invalid={Boolean(fieldErrors.password)}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
              />

              <button
                type="button"
                className="password-field__toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </label>

          <button
            type="submit"
            className="button button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-card__footer">
          Continue without an account? <Link to="/">Browse home</Link>
        </p>

        <div className="auth-card__hint">
          <strong>Seed accounts</strong>
          <p>admin@minishop.com / Password@123</p>
          <p>user@minishop.com / Password@123</p>
        </div>
      </div>
    </section>
  );
}
