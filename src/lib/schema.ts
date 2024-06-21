import {z} from "zod";

export const ProductSchema=z.object({
    name:z.string().trim().nonempty({
      message:"Name is required"
    }),
    description:z.string().trim().nonempty({
      message:"Description is required"
    }),
    price: z.string().trim().nonempty({
        message:"Price is required"
    })
  
  })
