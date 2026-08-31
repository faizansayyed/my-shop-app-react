import { memo } from "react";

interface Props {
  product: {
    _id: string;
    image: string;
    title: string;
    price: number;
    category: string;
  };
}

function ProductCard({ product }: Props) {
  console.log("render", product._id);

  return (
    <article key={product._id}>
      <img
        className="product-card__image"
        src={product.image}
        alt={product.title}
        loading="lazy"
      />

      <h3>{product.title}</h3>

      <p style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
        {product.category}
      </p>

      <strong>₹{product.price}</strong>
    </article>
  );
}

export const ProductCardComponent = memo(ProductCard);
