import { withAuth } from "next-auth/middleware";

// هنا نحدد المسارات التي يجب أن تكون محمية (لا يمكن لأحد دخولها إلا إذا كان مسجلاً)
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token, // يسمح بالدخول فقط إذا وجد الـ Token (أي المستخدم مسجل)
  },
});

// هنا نحدد المسارات التي سيطبق عليها الحارس
export const config = {
  matcher: [
    "/cart",      // صفحة السلة
    "/checkout",  // صفحة الدفع
    "/dashboard/:path*", // أي صفحة داخل لوحة التحكم
  ],
};