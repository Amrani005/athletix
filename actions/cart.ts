'use server';

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import {authOptions} from '@/lib/auth'

export async function addToCart(productId: string, size: string, quantity: number = 1) {
  try {
    const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "غير مصرح لك - يرجى تسجيل الدخول" };
  }

    const user = await db.user.findUnique({
      where: { useremail: session.user.email },
      include: { cart: true }
    });

    if (!user || !user.cart) {
      return { error: "لم يتم العثور على سلة تسوق." };
    }

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
      await db.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity }
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: user.cart.id,
          productId: productId,
          size: size,
          quantity: quantity
        }
      });
    }

    revalidatePath('/cart');
    revalidatePath('/collection');
    
    return { success: "تمت إضافة المنتج إلى السلة بنجاح!" };

  } catch (error) {
    console.error("Add to cart error:", error);
    return { error: "حدث خطأ غير متوقع أثناء إضافة المنتج." };
  }
}

export async function getUserCart() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = await db.user.findUnique({
      where: { useremail: session.user.email },
      include: {
        cart: {
          include: {
            item: {
              include: {
                product: true
              },
              orderBy: { id: 'asc' }
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
    if (!session?.user?.email) return 0;

    const user = await db.user.findUnique({
      where: { useremail: session.user.email },
      include: {
        cart: {
          include: { item: true }
        }
      }
    });

    if (!user || !user.cart) return 0;

    return user.cart.item.length;
  } catch (error) {
    return 0;
  }
}
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