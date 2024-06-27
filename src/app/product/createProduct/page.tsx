"use client";
import { useRouter } from "next/navigation";
import { createProduct } from "../../actions/actions";
import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ProductSchema } from "@/lib/schema";

export default function CreateProduct() {
  const { toast } = useToast();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const clientAction = async (formData: FormData) => {
    const newProduct = {
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
    const { success, error, message } = await createProduct(result.data);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Create Product</h1>
      <form ref={ref} action={clientAction} method="post" className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Product Name"
            name="name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Product Description</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            type="text"
            placeholder="Product Description"
            name="description"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Product Price</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            placeholder="Product Price"
            name="price"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
