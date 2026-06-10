import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const API_KEY = process.env.API_KEY;

    // هنا غيّر رابط الـ API إلى موقعك أو الموقع اللي تستعمله
    const response = await axios.post(
      "https://reqres.in/api/users",
      body,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`, // أو x-api-key لو الموقع يستخدمها
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Proxy error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}