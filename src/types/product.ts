export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductsResponse = {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ProductInput = {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
};
