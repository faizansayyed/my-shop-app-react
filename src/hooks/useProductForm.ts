import { useReducer } from "react";
import type { Product, ProductInput } from "../types/product";

const emptyForm: ProductInput = {
  title: "",
  description: "",
  price: 0,
  category: "",
  stock: 0,
  image: "",
};

type FormState = {
  form: ProductInput;
  isSubmitting: boolean;
  error: string;
};

type FormAction =
  | { type: "UPDATE_FIELD"; field: keyof ProductInput; value: string | number }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_END" }
  | { type: "SET_ERROR"; message: string };

function getInitialState(product?: Product): FormState {
  return {
    form: product
      ? {
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          image: product.image,
        }
      : emptyForm,
    isSubmitting: false,
    error: "",
  };
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
      };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, error: "" };
    case "SUBMIT_END":
      return { ...state, isSubmitting: false };
    case "SET_ERROR":
      return { ...state, error: action.message };
    default:
      return state;
  }
}

type UseProductFormOptions = {
  product?: Product;
  onSuccess: () => void;
};

export function useProductForm({ product, onSuccess }: UseProductFormOptions) {
  const [state, dispatch] = useReducer(formReducer, product, getInitialState);

  const isEditMode = Boolean(product);

  function updateField(field: keyof ProductInput, value: string | number) {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }

  async function submitForm(event: SubmitEvent) {
    event.preventDefault();
    dispatch({ type: "SUBMIT_START" });

    const url = isEditMode
      ? `http://localhost:4000/api/products/${product?.id}`
      : "http://localhost:4000/api/products";

    try {
      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Failed to ${isEditMode ? "update" : "add"} product`,
        );
      }

      onSuccess();
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      dispatch({ type: "SUBMIT_END" });
    }
  }

  return {
    form: state.form,
    isSubmitting: state.isSubmitting,
    error: state.error,
    isEditMode,
    updateField,
    submitForm,
  };
}
