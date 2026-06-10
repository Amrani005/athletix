"use server"

import {db} from "@/lib/db";
import { revalidatePath } from "next/cache";
import { describe } from "node:test";

export async function updateProducts(formData:FormData){
    try{

        const id = formData.get("id") as string;
        if(!id)return;
        await db.product.update({
            where:{
                id:id
            },
            data:{
                name: formData.get("name")as string,
                price: Number(formData.get("price")),
                description:(formData.get("description")as string) || null,
                imageUrl: (formData.get("imageUrl") as string )||"",
                images: (formData.get("images")as string)||"[]"
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