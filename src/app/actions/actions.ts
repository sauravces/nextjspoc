"use server";
import { revalidatePath } from "next/cache";
import Requests from "@/app/service/request";
import { ProductSchema } from "@/lib/schema";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
}

const endpoints = Requests();

export async function createProduct(newProduct: unknown) {
  const result1 = ProductSchema.safeParse(newProduct);
  if (!result1.success) {
    let errorMessage = "";
    result1.error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
    });

    return {
      error: errorMessage,
    };
  }
  try {
    const response = await fetch(endpoints.createProduct, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result1.data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();

    revalidatePath("/product/productList");
    console.log(result);
    return {
      success: true,
      message: `Added product ${result1.data.name}`,
      product: result,
    };
  } catch (e) {
    console.error("Error creating product:", e);
    return { success: false, message: "Failed to create product" };
  }
}

export async function deleteProduct(productId: string) {
    try {
      const response = await fetch(`${endpoints.deleteProductById}/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      revalidatePath("/product/productList");
      return {
        success: true,
        message: `Deleted product successfully`,
        product: result
      };
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        message: "Failed to delete product"
      };
    }
  }
  
  export async function getAllProduct() {
    try {
      const response = await fetch(endpoints.getAllProducts, { headers: { cache: 'force-cache' } });
  
      if (!response.ok) {
        return {
          success: false,
          message: `HTTP error! Status: ${response.status}`,
          product: [],
        };
      }
  
      const data = await response.json();
  
      const products = data.map((product: any) => ({
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
      }));
  
      return {
        success: true,
        message: `Get product successfully.`,
        product: products,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        success: false,
        message: `Get product failed.`,
        product: [],
      };
    }
  }  