export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
  }

export interface ProductTableProps {
    initialProducts: Product[];
  }