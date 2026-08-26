import { useState } from "react";
import { Link } from "react-router-dom";

import CartDropdown from "../cart/CartDropdown";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { selectCartCount } from "../../store/cartSelectors";

import { selectAuthStatus, selectUser } from "../../store/authSelectors";

import { logout } from "../../store/authSlice";

export default function Header() {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  const cartCount = useAppSelector(selectCartCount);
  const status = useAppSelector(selectAuthStatus);
  const user = useAppSelector(selectUser);

  return (
    <header className="header">
      <h1>Mini Shop</h1>

      <div className="header__actions">
        <div className="cart-wrapper">
          <button
            type="button"
            className="cart-button"
            onClick={() => setOpen(!open)}
          >
            Cart ({cartCount})
          </button>

          {open && <CartDropdown />}
        </div>

        {status === "authenticated" && user ? (
          <div className="header__user">
            <span>
              {user.name}
              <small> ({user.role})</small>
            </span>

            <button
              type="button"
              className="button button--secondary"
              onClick={() => dispatch(logout())}
            >
              Logout
            </button>
          </div>
        ) : status === "guest" ? (
          <Link to="/login" className="button button--primary">
            Sign in
          </Link>
        ) : null}
      </div>
    </header>
  );
}
