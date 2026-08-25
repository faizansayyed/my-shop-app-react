import { useReducer } from "react";
import type { FormEvent } from "react";
import type { ProductInput } from "../types/product";

const initialForm: ProductInput = {
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

const initialState: FormState = {
  form: initialForm,
  isSubmitting: false,
  error: "",
};

type UseProductFormProps = {
  onSuccess: () => void;
};

type UseProductFormReturn = {
  form: ProductInput;
  isSubmitting: boolean;
  error: string;
  updateField: (field: keyof ProductInput, value: string | number) => void;
  submitForm: (event: SubmitEvent) => void; // or Promise<void> if they want to await
};

type FormAction =
  | { type: "UPDATE_FIELD"; field: keyof ProductInput; value: string | number }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_END" }
  | { type: "SET_ERROR"; message: string }
  | { type: "RESET" };

function formReducer(state: FormState, action: FormAction) {
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
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useProductForm({
  onSuccess,
}: UseProductFormProps): UseProductFormReturn {
  const [state, dispatch] = useReducer(formReducer, initialState);

  function updateField(field: keyof ProductInput, value: string | number) {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }

  async function submitForm(event: SubmitEvent) {
    event.preventDefault();

    dispatch({ type: "SUBMIT_START" });

    try {
      const response = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add product");
      }

      dispatch({ type: "RESET" });
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
    updateField,
    submitForm,
  };
}
