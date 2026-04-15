export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  images: string[];
  categoryId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
