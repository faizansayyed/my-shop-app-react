import {
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearSearchResults, searchProducts } from "../../store/productSlice";
import { ProductCardComponent } from "./ProductCardComponent";

const DEBOUNCE_DELAY = 500;

export function ProductSearch() {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const { searchResults, searchLoading, searchError } = useAppSelector(
    (state) => state.products,
  );

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const query = deferredSearchTerm.trim();

    if (!query) {
      dispatch(clearSearchResults());
      return;
    }

    // Tell TS: this thing has an abort() method
    let activeRequest: { abort: () => void } | undefined;

    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        activeRequest = dispatch(searchProducts(query)) as {
          abort: () => void;
        };
      });
    }, DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
      activeRequest?.abort(); // ✅ No error
    };
  }, [deferredSearchTerm, dispatch]);


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

      {isPending && "Loading new result"}

      {!searchLoading && searchTerm.trim() && searchResults.length === 0 && (
        <p>No products found.</p>
      )}

      <div className="product-grid">
        {searchResults.map((product) => (
          <ProductCardComponent product={product} />
        ))}
      </div>
    </section>
  );
}
