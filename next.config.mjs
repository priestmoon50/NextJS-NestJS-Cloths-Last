/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // یا می‌توانید false کنید

  images: {
      domains: ['localhost'], // اجازه بارگذاری تصاویر از localhost
  },

  async rewrites() {
      return [
          {
              source: '/uploads/:path*', // مسیر آپلود در فرانت
              destination: 'http://localhost:3001/uploads/:path*', // مسیر به سرور بک‌اند
          },
      ];
  },
};

export default nextConfig;
