'use client';
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Box, Container } from '@mui/material';
import './globals.css';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import Head from 'next/head';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

const Layout: React.FC<{ children: React.ReactNode; dehydratedState?: unknown }> = ({ children, dehydratedState }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <Head>
        <title>My Clothing Shop | High-Class Women's Fashion | ModaPersia</title>
        <meta name="description" content="Shop the latest high-class women's fashion at My Clothing Shop. Explore our exclusive collections now!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            <CartProvider>
              <NavBar />
              <Container sx={{ minWidth: '80%' }}>
                <Box my={4}>{children}</Box>
              </Container>
              <Footer />
            </CartProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </body>
    </html>
  );
};

export default Layout;