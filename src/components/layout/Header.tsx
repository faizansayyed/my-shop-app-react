import { useState } from "react";

import CartDropdown from "../cart/CartDropdown";

import { selectCartCount } from "../../store/cartSelectors";

import { useAppSelector } from "../../store/hooks";

export default function Header() {
  const [open, setOpen] = useState(false);

  const cartCount = useAppSelector(selectCartCount);

  return (
    <header className="header">
      <h1>Mini Shop</h1>

      <div className="cart-wrapper">
        <button className="cart-button" onClick={() => setOpen(!open)}>
          Cart ({cartCount})
        </button>

        {open && <CartDropdown />}
      </div>
    </header>
  );
}
