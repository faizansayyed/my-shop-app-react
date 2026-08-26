import { selectCartCount, selectCartTotal } from "../../store/cartSelectors";

import { useAppSelector } from "../../store/hooks";

export default function Header() {
  const cartCount = useAppSelector(selectCartCount);
  const cartTotal = useAppSelector(selectCartTotal);

  return (
    <header className="header">
      <h1>Mini Shop</h1>

      <div className="cart-summary">
        <span>Cart: ${cartTotal.toFixed(2)}</span>

        <span className="cart-summary__count">{cartCount}</span>
      </div>
    </header>
  );
}
