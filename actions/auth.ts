'use server';

import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function registerUser(name: string, email: string, password: string) {
  try {
    const existingUser = await db.user.findUnique({
      where: { useremail: email }
    });

    if (existingUser) {
      return { error: "This email is already registered." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

     await db.user.create({
      data: {
        username: name,
        useremail: email,
        userpassword: hashedPassword,
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