import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../../store/cartSlice";

import { selectCartItems, selectCartTotal } from "../../store/cartSelectors";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

export default function CartDropdown() {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);

  const total = useAppSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="cart-dropdown">
        <p>Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart-dropdown">
      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <div>
            <strong>{item.title}</strong>

            <div>${item.price}</div>
          </div>

          <div className="cart-item__actions">
            <button className="cart-button" onClick={() => dispatch(decreaseQuantity(item.id))}>
              -
            </button>

            <span>{item.quantity}</span>

            <button className="cart-button" onClick={() => dispatch(increaseQuantity(item.id))}>
              +
            </button>

            <button className="cart-button" onClick={() => dispatch(removeFromCart(item.id))}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="cart-total">Total: ${total.toFixed(2)}</div>
    </div>
  );
}
