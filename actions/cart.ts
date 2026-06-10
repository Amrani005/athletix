'use server';

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import {authOptions} from '@/lib/auth'

// ==========================================
// 1. دالة إضافة منتج إلى السلة (Add To Cart)
// ==========================================
export async function addToCart(productId: string, size: string, quantity: number = 1) {
  try {
    // 1. التحقق من هوية المستخدم (يجب أن يكون مسجل الدخول)
    const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "غير مصرح لك - يرجى تسجيل الدخول" };
  }

    // 2. جلب المستخدم وسلة التسوق الخاصة به
    const user = await db.user.findUnique({
      where: { useremail: session.user.email },
      include: { cart: true }
    });

    if (!user || !user.cart) {
      return { error: "لم يتم العثور على سلة تسوق." };
    }

    // 3. التحقق مما إذا كان هذا المنتج بنفس المقاس موجوداً مسبقاً في السلة
    const existingCartItem = await db.cartItem.findUnique({
      where: {
        cartId_productId_size: {
          cartId: user.cart.id,
          productId: productId,
          size: size
        }
      }
    });

    if (existingCartItem) {
      // إذا كان موجوداً: نقوم بزيادة الكمية فقط (لا ننشئ سطراً جديداً)
      await db.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity }
      });
    } else {
      // إذا لم يكن موجوداً: نقوم بإنشاء عنصر جديد داخل السلة
      await db.cartItem.create({
        data: {
          cartId: user.cart.id,
          productId: productId,
          size: size,
          quantity: quantity
        }
      });
    }

    // 4. تحديث مسارات الواجهة الأمامية فوراً ليعكس العداد التغيير
    revalidatePath('/cart');
    revalidatePath('/collection'); // أو أي صفحة تعرض المنتجات
    
    return { success: "تمت إضافة المنتج إلى السلة بنجاح!" };

  } catch (error) {
    console.error("Add to cart error:", error);
    return { error: "حدث خطأ غير متوقع أثناء إضافة المنتج." };
  }
}

// ==========================================
// 2. دالة جلب محتويات السلة (Get User Cart)
// ==========================================
export async function getUserCart() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    // جلب المستخدم مع سلته، و"تضمين" العناصر، و"تضمين" تفاصيل المنتج الفعلي داخل كل عنصر
    const user = await db.user.findUnique({
      where: { useremail: session.user.email },
      include: {
        cart: {
          include: {
            item: {
              include: {
                product: true // نحتاج بيانات المنتج (الصورة، السعر، الاسم) لعرضها
              },
              orderBy: { id: 'asc' } // ترتيب العناصر لكي لا تتغير أماكنها عند تحديث الكمية
            }
          }
        }
      }
    });

    if (!user || !user.cart) return null;

    return user.cart.item;

  } catch (error) {
    console.error("Get cart error:", error);
    return null;
  }
}

// ==========================================
// 3. دالة حذف عنصر من السلة (Remove Item)
// ==========================================
export async function removeCartItem(cartItemId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "غير مصرح." };

    await db.cartItem.delete({
      where: { id: cartItemId }
    });

    revalidatePath('/cart');
    return { success: "تم حذف المنتج من السلة." };

  } catch (error) {
    console.error("Remove item error:", error);
    return { error: "حدث خطأ أثناء حذف المنتج." };
  }
}

export async function getCartItemsCount() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return 0; // إذا لم يكن مسجلاً، السلة صفر

    const user = await db.user.findUnique({
      where: { useremail: session.user.email },
      include: {
        cart: {
          include: { item: true } // نجلب العناصر لنحسب عددها
        }
      }
    });

    if (!user || !user.cart) return 0;

    // نرجع طول المصفوفة الحقيقي من قاعدة بيانات Neon
    return user.cart.item.length;
  } catch (error) {
    return 0;
  }
}
// دالة لتحديث كمية المنتج داخل السلة
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: quantity }
    });
    return { success: true };
  } catch (error) {
    console.error("Update quantity error:", error);
    return { error: "فشل تحديث الكمية" };
  }
}