'use server';

import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function registerUser(name: string, email: string, password: string) {
  try {
    // 1. التأكد من أن البريد الإلكتروني غير مسجل مسبقاً
    const existingUser = await db.user.findUnique({
      where: { useremail: email }
    });

    if (existingUser) {
      return { error: "This email is already registered." }; // البريد مسجل مسبقاً
    }

    // 2. تشفير كلمة المرور لحمايتها
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. الخطوة السحرية: إنشاء المستخدم وإنشاء سلة فارغة له في نفس اللحظة!
     await db.user.create({
      data: {
        username: name,
        useremail: email,
        userpassword: hashedPassword,
        // Prisma تسمح لنا بإنشاء السلة المرتبطة به مباشرة بفضل العلاقات التي بنيناها
        cart: {
          create: {} 
        }
      }
    });

    return { success: "Account and Cart created successfully!" };
    
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An error occurred during registration." };
  }
}