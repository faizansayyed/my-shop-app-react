import type { Product } from "../../types/product";
import { useProductForm } from "../../hooks/useProductForm";

type ProductFormProps = {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const { form, isSubmitting, error, isEditMode, updateField, submitForm } =
    useProductForm({ product, onSuccess });

  return (
    <form
      className="product-form"
      onSubmit={(event) => submitForm(event.nativeEvent as SubmitEvent)}
    >
      {error && <p className="error-message">{error}</p>}

      <label>
        Product name
        <input
          required
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </label>

      <label>
        Description
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </label>

      <div className="product-form__row">
        <label>
          Price
          <input
            required
            min="0"
            step="0.01"
            type="number"
            value={form.price}
            onChange={(e) => updateField("price", Number(e.target.value))}
          />
        </label>

        <label>
          Stock
          <input
            required
            min="0"
            step="1"
            type="number"
            value={form.stock}
            onChange={(e) => updateField("stock", Number(e.target.value))}
          />
        </label>
      </div>

      <label>
        Category
        <input
          required
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        />
      </label>

      <label>
        Image URL
        <input
          type="url"
          value={form.image}
          onChange={(e) => updateField("image", e.target.value)}
        />
      </label>

      <div className="product-form__actions">
        <button
          type="button"
          className="button button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Adding..."
            : isEditMode
              ? "Update Product"
              : "Add Product"}
        </button>
      </div>
    </form>
  );
}
