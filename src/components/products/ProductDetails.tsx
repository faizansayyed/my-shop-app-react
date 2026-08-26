import type { Product } from "../../types/product";

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="product-details">
      {product.image}

      <div className="product-details__content">
        <span className="product-card__category">{product.category}</span>

        <h3>{product.title}</h3>

        <p>{product.description}</p>

        <dl className="product-details__list">
          <div>
            <dt>Price</dt>
            <dd>${product.price.toFixed(2)}</dd>
          </div>

          <div>
            <dt>Available stock</dt>
            <dd>{product.stock}</dd>
          </div>

          <div>
            <dt>Product ID</dt>
            <dd>#{product.id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
