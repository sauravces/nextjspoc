import ProductTable from "./productlist";
import { Product } from "@/lib/types";
import { getAllProductAction } from "@/app/actions/actions";

export default async function SSRProducts() {
  try {
    const products = await getAllProductAction();

    if (!products.success) {
      throw new Error(products.message || "Failed to fetch products");
    }

    const products1: Product[] | undefined = products.product;

    return (
      <>
        { products1 !== undefined
          ? <ProductTable initialProducts={products1} />
          : "Failed to Load the Products"
        }
      </>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return "Failed to Load the Products";
  }
}