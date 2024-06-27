"use client"
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
      price:formData.get("price") as string,
    };
    const result = ProductSchema.safeParse(newProduct);
    if (!result.success) {
      let errorMessage = "";
      result.error.issues.forEach((issue) => {
        errorMessage =
          errorMessage + issue.path[0] + ": " + issue.message + ". ";
      });
      toast({
        variant: "destructive",
        description: `${errorMessage}`,
      });
      return;
    }
    console.log(result.data);
    const { success, error,message } = await createProduct(result.data);
    if (error) {
      toast({
        variant: "destructive",
        description: `${error}`,
      });
    }
    if (success==true) {
      router.push("/product/productList");
    }
  };

  return (
    <>
      <h1>Server Action Page</h1>
      <form ref={ref} action={clientAction} method="post">
        <input
          style={{ backgroundColor: "gray", marginLeft: "10px" }}
          placeholder="product name"
          type="text"
          name="name"
        />
        <input
          style={{ backgroundColor: "gray", marginLeft: "10px" }}
          placeholder="product description"
          type="text"
          name="description"
        />
        <input
          style={{ backgroundColor: "gray", marginLeft: "10px" }}
          placeholder="product price"
          type="number"
          name="price"
        />
        <button style={{ marginLeft: "10px" }}>Submit</button>
      </form>
    </>
  );
}