import type { Product } from "../../types/product";

type ProductCardProps = {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
};

export default function ProductCard({
  product,
  onView,
  onEdit,
}: ProductCardProps) {
  return (
    <article className="product-card">
      {product.image}

      <div className="product-card__content">
        <span className="product-card__category">{product.category}</span>

        <h3>{product.title}</h3>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__info">
          <strong>${product.price.toFixed(2)}</strong>
          <span>{product.stock} in stock</span>
        </div>

        <div className="product-card__actions">
          <button type="button" className="button button--primary">
            Add to Cart
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

          <button type="button" className="button button--danger">
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
