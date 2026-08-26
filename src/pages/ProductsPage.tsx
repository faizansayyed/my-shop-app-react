import { useEffect, useState } from "react";
import type { Product, ProductsResponse } from "../types/product";
import ProductCard from "../components/products/ProductCard";
import Modal from "../components/common/Modal";
import ProductForm from "../components/products/ProductForm";
import ProductDetails from "../components/products/ProductDetails";

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(false);
    fetchProducts();
  }, []);

  function handleViewProduct(product: Product) {
    setSelectedProduct(product);
  }

  function handleCloseViewModal() {
    setSelectedProduct(null);
  }

  function handleEditProduct(product: Product) {
    setEditingProduct(product);
  }

  function handleCloseEditModal() {
    setEditingProduct(null);
  }

  async function handleProductUpdated() {
    setEditingProduct(null);
    await fetchProducts();
  }

  async function fetchProducts() {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4000/api/products");
      if (!response.ok) {
        throw new Error("Failed to load products");
      }
      const result: ProductsResponse = await response.json();
      setProducts(result.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleProductAdded() {
    setIsModalOpen(false);
    await fetchProducts();
  }

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <section className="products-page">
      <div className="products-page__header">
        <div>
          <h2>Products</h2>
          <p>Browse and manage shop products.</p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
            />
          ))}
        </div>
      )}

      <Modal
        title="Add Product"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <ProductForm
          onSuccess={handleProductAdded}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        title="Product Details"
        isOpen={selectedProduct !== null}
        onClose={handleCloseViewModal}
      >
        {selectedProduct && <ProductDetails product={selectedProduct} />}
      </Modal>
      <Modal
        title="Edit Product"
        isOpen={editingProduct !== null}
        onClose={handleCloseEditModal}
      >
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSuccess={handleProductUpdated}
            onCancel={handleCloseEditModal}
          />
        )}
      </Modal>
    </section>
  );
}
