import type { Product } from "../../types/product";

import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/cartSlice";

type ProductCardProps = {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const dispatch = useAppDispatch();

  function handleAddToCart() {
    dispatch(addToCart(product));
  }

  return (
    <article className="product-card">
      {product.image}

      <div className="product-card__content">
        <span className="product-card__category">{product.category}</span>

        <h3>{product.title}</h3>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__info">
          <strong>${product.price.toFixed(2)}</strong>

          <span>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        <div className="product-card__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          <button
            type="button"
            className="button button--secondary"
            onClick={() => onView(product)}
          >
            View
          </button>

          <button
            type="button"
            className="button button--secondary"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>

          <button
            type="button"
            className="button button--danger"
            onClick={() => onDelete(product)}
            aria-label={`Delete ${product.title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
