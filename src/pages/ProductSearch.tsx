import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearSearchResults, searchProducts } from "../store/productSlice";

const DEBOUNCE_DELAY = 500;

export function ProductSearch() {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const { searchResults, searchLoading, searchError } = useAppSelector(
    (state) => state.products,
  );

  useEffect(() => {
    const query = searchTerm.trim();

    if (!query) {
      dispatch(clearSearchResults());
      return;
    }

    // Tell TS: this thing has an abort() method
    let activeRequest: { abort: () => void } | undefined;

    const timeoutId = window.setTimeout(() => {
      activeRequest = dispatch(searchProducts(query)) as { abort: () => void };
    }, DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
      activeRequest?.abort(); // ✅ No error
    };
  }, [searchTerm, dispatch]);

  return (
    <section>
      <input
        type="search"
        value={searchTerm}
        placeholder="Search products..."
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {searchLoading && <p>Searching...</p>}

      {searchError && <p role="alert">{searchError}</p>}

      {!searchLoading && searchTerm.trim() && searchResults.length === 0 && (
        <p>No products found.</p>
      )}

      <div className="product-grid">
        {searchResults.map((product) => (
          <article key={product._id}>
            {product.image}

            <h3>{product.title}</h3>

            <p>{product.category}</p>

            <strong>₹{product.price}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
