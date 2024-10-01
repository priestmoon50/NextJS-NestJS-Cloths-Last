'use client';  
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Typography, Box, Container } from '@mui/material';
import './globals.css';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import Head from 'next/head';  // اضافه کردن Head برای بهینه‌سازی SEO
import Footer from '@/components/Footer';

const Layout: React.FC<{ children: React.ReactNode; dehydratedState: unknown }> = ({ children, dehydratedState }) => {
  const [queryClient] = useState(() => new QueryClient());  // ساخت QueryClient در اولین رندر

  return (
    <>
      <Head>
        <title>My Clothing Shop | High-Class Women's Fashion | ModaPersia</title> {/* اضافه کردن عنوان صفحه */}
        <meta name="description" content="Shop the latest high-class women's fashion at My Clothing Shop. Explore our exclusive collections now!" /> {/* توضیحات متا */}
        <meta name="viewport" content="width=device-width, initial-scale=1" /> {/* برای ریسپانسیو */}
      </Head>
      <html lang="en">
        <body>
          <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
              <NavBar />
              <Container sx={{ minWidth: '80%' }}>
                <Box my={4}>{children}</Box>
              </Container>
              <Footer /> {/* اضافه کردن کامپوننت فوتر */}
            </HydrationBoundary>
          </QueryClientProvider>
        </body>
      </html>
    </>
  );
};

export default Layout;
