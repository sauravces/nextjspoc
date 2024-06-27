import ProductTable from "./productlist";
import { getAllProduct } from "@/app/actions/actions";
import Loading from "@/app/loading";
import ErrorComponent from "@/app/error";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
}

export default async function SSRProducts() {
  let products: Product[] | undefined;
  try {
    const productsResponse = await getAllProduct();

    if (!productsResponse.success) {
      throw new Error(productsResponse.message || "Failed to fetch products");
    }

    products = productsResponse.product;
  } catch (error) {
    return <ErrorComponent error={error as Error} />;
  }

  return (
    <>
      {products ? <ProductTable initialProducts={products} /> : <Loading />}
    </>
  );
}
