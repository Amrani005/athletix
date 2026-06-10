'use server'
import {db} from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteProducts(formData:FormData){
  try{
    const productId = formData.get("id") as string;
    if(!productId)return;

    await db.product.delete({
        where:{
            id:productId,
        }
    })
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard");
    revalidatePath("/");

  }catch(error){

    console.error("❌ حدث خطأ أثناء الحذف:", error);

  }
}