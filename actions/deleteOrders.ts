'use server'

import {db} from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteOrders(formData:FormData){
    try{
        const orderId = formData.get("id") as string;
            
        if(!orderId)return;

        await db.order.delete({
            where:{
                id:orderId,
            }
        })
       revalidatePath("/dashboard/orders");
       revalidatePath("/dashboard/draft");
       revalidatePath("/");

    }catch(error){
        console.error("E got error while deleting the order", error);
        alert("error while deleting the order")
    }
     
}