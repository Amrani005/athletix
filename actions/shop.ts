'use server'

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache"; 

//Method to get the product data
export async function getProductById(id: string){
    if(!id)return ;
    const product = await db.product.findUnique({
        where:{id:id},

    })
    return product;
}
export async function saveDraftOrder(data: any) {
   const orderItems = JSON.stringify({
     productId : data.productId,
     quantity: data.quantity,
     price: data.price,
     wilya : data.wilaya, 
     deliveryType: data.deliveryType,
     size: data.size || "Standard"
   });
   
   // تم إصلاح الخطأ الإملائي هنا (address بدلاً من adress)
   const fullAdress = `${data.address} - ولاية: ${data.wilaya} (${data.deliveryType})`;

   let resultDraftId = null;

   if(data.draftId){
    await db.order.update({
      where : {id : data.draftId},
      data:{
        customerName: data.name,
        customerPhone: data.phone,
        customerAddress: fullAdress,
        totalPrice: Number(data.total),
        status: "draft", 
        orderItems: orderItems, 
      }
    });
    resultDraftId = data.draftId;
   } else {
    const newDraft = await db.order.create({
      data:{
         customerName: data.name,
        customerPhone: data.phone,
        customerAddress: fullAdress,
        totalPrice: Number(data.total),
        status: "draft", 
        orderItems: orderItems, 
      }
    });
    resultDraftId = newDraft.id;

    if (data.phone) {
        const baserowData = {
            "Name": data.name || "بدون اسم",
            "Phone": data.phone,
            "Wilaya": data.wilaya,
            "Address": fullAdress,     
            "Product": data.productName || "منتج",
            "Price": data.total?.toString() || "0",
            "Delivery": "غير محدد",
            "Status": "مسودة (Draft)", 
            "Date": new Date().toLocaleString('ar-DZ')
        };
       
    }
   }
   
   // غسيل الكاش للداشبورد
   revalidatePath("/dashboard/draft");
   revalidatePath("/dashboard/orders");
   revalidatePath("/dashboard");

   return {draftId : resultDraftId}
}

export async function placeOrder(data:any){
    
       const orderDetail = JSON.stringify({
          productId : data.productId,
          quantity: data.quantity,
          price: data.price,
          wilya : data.wilaya,
          deliveryType: data.deliveryType,
          size: data.size || "Standard"
       })
       const fullAdress = `${data.address}-wilaya:${data.wilaya} (${data.deliveryType})`

       const newOrder = await db.order.create({
        data:{
            customerName: data.name,
            customerPhone: data.phone,
            customerAddress: fullAdress,
            totalPrice: Number(data.total),
            status: "pending", 
            orderItems: orderDetail,
        }
       })

       if (newOrder) {
          const baserowData = {
            "Name": data.name,
            "Phone": data.phone,
            "Wilaya": data.wilaya,
            "Address": fullAdress,
            "Product": data.productName || "منتج",
            "Price": data.total.toString(),
            "Delivery": data.deliveryType,
            "Status": "طلب جديد (New)", 
            "Date": new Date().toLocaleString('ar-DZ')
        };
         

        revalidatePath("/dashboard/orders");
        revalidatePath("/dashboard/draft");
        revalidatePath("/dashboard");

       return { success: true, orderId: newOrder.id };
    }
   
}

export async function deletDraft(formData: FormData){
  const draftId = formData.get("draftId") as string;
   await db.order.deleteMany({
    where:{
      id:draftId
    }
   });
   
   revalidatePath("/dashboard/draft");
   revalidatePath("/dashboard");
}
export async function addToCart(productId: string, selectedSize: string, quantity: number = 1) {
  try{
    // 1. التحقق من هوية المستخدم (يجب أن يكون مسجل الدخول)
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return { error: "User not authenticated." };
    }

    const user = await db.user.findUnique({
      where: { useremail: session.user.email },
      include: { cart: true }
    })
    if (!user ){
      return { error: "account not found." };
    }
    // إذا لم يكن لديه سلة لأي سبب، نقوم بإنشائها له
    let userCart = user.cart;
    if (!userCart) {
      userCart = await db.cart.create({
        data: { userId: user.id }
      });
    }

    // 3. التحقق مما إذا كان هذا المنتج بنفس المقاس موجوداً بالفعل داخل سلته
    const existingCartItem = await db.cartItem.findUnique({
      where: {
        cartId_productId_size: {
          cartId: userCart.id,
          productId: productId,
          size: selectedSize
        }
      }
    });

    // 4. إذا كان موجوداً، نقوم بزيادة الكمية فقط لتجنب التكرار
    if (existingCartItem) {
      await db.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity }
      });
    } 
    // 5. إذا لم يكن موجوداً، نقوم بإنشاء عنصر جديد في السلة
    
      await db.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: productId,
          size: selectedSize,
          quantity: quantity
        }
      });
    

    // إرجاع رسالة نجاح للواجهة الأمامية
    return {success: "Product added to cart successfully!"}

     
  } catch (error) {
    return { error:"error has occured "}
   }
}