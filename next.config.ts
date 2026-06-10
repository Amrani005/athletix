/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // هذا السطر يخبر Vercel بتجاهل أخطاء ESLint أثناء البناء
    ignoreDuringBuilds: true,
  },
  typescript: {
    // هذا السطر يخبر Vercel بتجاهل أخطاء TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig; // إذا كان الملف ينتهي بـ .js استخدم: module.exports = nextConfig;