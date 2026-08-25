import { useProductForm } from "../../hooks/useProductForm";

type ProductFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
  const { form, isSubmitting, error, updateField, submitForm } = useProductForm(
    { onSuccess },
  );

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
          onChange={(event) => updateField("title", event.target.value)}
        />
      </label>

      <label>
        Description
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
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
            onChange={(event) =>
              updateField("price", Number(event.target.value))
            }
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
            onChange={(event) =>
              updateField("stock", Number(event.target.value))
            }
          />
        </label>
      </div>

      <label>
        Category
        <input
          required
          value={form.category}
          onChange={(event) => updateField("category", event.target.value)}
        />
      </label>

      <label>
        Image URL
        <input
          type="url"
          placeholder="https://example.com/product.jpg"
          value={form.image}
          onChange={(event) => updateField("image", event.target.value)}
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
          {isSubmitting ? "Adding..." : "Add Product"}
        </button>
      </div>
    </form>
  );
}
