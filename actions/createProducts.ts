"use server"

import {db} from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createProducts(formData:FormData){
    try{
        await db.product.create({
            data:{
                name: formData.get("name")as string,
                price: Number(formData.get("price")),
                description:(formData.get("description")as string) || null,
                imageUrl: (formData.get("imageUrl") as string )||"",
                images: (formData.get("images")as string)||"[]",
                size : (formData.get("size")as string) || undefined,
            }
        })
        revalidatePath("/dashboard/products");
        revalidatePath("/"); 
        return {success:true};
    }catch(error){
        console.error("Error creating product: ", error);
        return {success:false};
    }
}