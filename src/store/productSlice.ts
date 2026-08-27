import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { apiRequest } from "../services/apiClient";

export interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

interface SearchResponse {
  products: Product[];
}

interface ProductState {
  searchResults: Product[];
  searchLoading: boolean;
  searchError: string | null;
}

const initialState: ProductState = {
  searchResults: [],
  searchLoading: false,
  searchError: null,
};

export const searchProducts = createAsyncThunk<
  SearchResponse, // return type on success
  string, // argument type (query)
  { rejectValue: string } // rejection value type
>("products/searchProducts", async (query, { signal, rejectWithValue }) => {
  try {
    // apiRequest now returns TResponse directly and throws on error
    const data = await apiRequest<SearchResponse>(
      `/products/search?q=${encodeURIComponent(query)}`,
      { signal },
    );
    return data; // <-- returns the parsed JSON (SearchResponse)
  } catch (error) {
    // AbortError is thrown by fetch when the signal is aborted
    if (error instanceof Error && error.name === "AbortError") {
      throw error; // re-throw to let RTK handle cancellation
    }

    // All other errors become a rejectValue
    return rejectWithValue(
      error instanceof Error ? error.message : "Search failed",
    );
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.searchResults = [];
      state.searchError = null;
      state.searchLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(
        searchProducts.fulfilled,
        (state, action: PayloadAction<SearchResponse>) => {
          state.searchLoading = false;
          state.searchResults = action.payload.products;
        },
      )
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;

        // Ignore aborted requests – they're expected
        if (action.meta.aborted) {
          return;
        }

        state.searchError =
          action.payload ?? action.error.message ?? "Search failed";
      });
  },
});

export const { clearSearchResults } = productSlice.actions;
export default productSlice.reducer;
