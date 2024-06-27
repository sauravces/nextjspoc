'use client'
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, editProduct } from "../../actions/actions";
import { useToast } from "@/components/ui/use-toast";
import { ProductSchema } from "@/lib/schema";
import Loading from "./loading";
import ErrorComponent from "./error";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
}

export default function EditProduct() {
  const router = useRouter();
  const { productId } = useParams();
  const { toast } = useToast();
  const ref = useRef<HTMLFormElement>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProduct = async () => {
      if (typeof productId === "string") {

        const { success, product: fetchedProduct, message } =
          await getProductById(productId);

        if (success) {
          setProduct(fetchedProduct);
          setLoading(false);
        } else {
            setLoading(false);
            setError(message);
        }
      }
    };

    fetchProduct();
  }, [productId]);

  const clientAction = async (formData: FormData) => {
    const newProduct = {
     id:productId as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
    };
    const result = ProductSchema.safeParse(newProduct);
    if (!result.success) {
      let errorMessage = "";
      result.error.issues.forEach((issue) => {
        errorMessage += `${issue.path[0]}: ${issue.message}. `;
      });
      toast({
        variant: "destructive",
        description: `${errorMessage}`,
      });
      return;
    }
    console.log(result.data);
    const { success, error, message } = await editProduct(newProduct);
    if (error) {
      toast({
        variant: "destructive",
        description: `${error}`,
      });
    }
    if (success) {
      router.push("/product/productList");
    }
  };

  if (loading) {
    return <Loading></Loading>
  }

  return <>
    {product!=null ?<>
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Update Product</h1>
      <form
        ref={ref}
        onSubmit={(e) => {
          e.preventDefault();
          clientAction(new FormData(ref.current!));
        }}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Product Name
          </label>
          <input
            defaultValue={product?.name}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Product Name"
            name="name"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Product Description
          </label>
          <input
            defaultValue={product?.description}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            type="text"
            placeholder="Product Description"
            name="description"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Product Price
          </label>
          <input
            defaultValue={product?.price}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            placeholder="Product Price"
            name="price"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update
          </button>
        </div>
      </form>
    </div>
    </>
    :<><ErrorComponent message={error}></ErrorComponent></>}
  </>
}
