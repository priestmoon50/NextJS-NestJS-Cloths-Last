'use client';

import { Container, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import Slider from "react-slick";
import styles from "./ProductGrid.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "@/data/types";

// تابع fetch محصولات
const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get("http://localhost:3001/products");

  // بررسی اینکه آیا API لیستی از محصولات را برمی‌گرداند
  if (Array.isArray(data)) {
    return data.map((product: any) => ({
      ...product,
      id: product._id, // تبدیل _id به id
    }));
  } else {
    console.error("Error: API did not return an array");
    return [];
  }
};

export default function ProductGrid() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // استفاده از React Query برای دریافت محصولات
  const { data: products = [], isLoading, error } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching products</div>;

  // تنظیمات اسلایدر بر اساس سایز صفحه
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 2 : isTablet ? 3 : 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    rtl: true,
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Slider {...sliderSettings}>
        {products.map((product) => (
          <Box key={product.id} className={styles.productCard}>
            <Box sx={{ position: "relative", height: "300px", mb: 2 }}>
              <Image
                src={product.images?.[0] || "/placeholder.jpg"} // نمایش اولین تصویر یا placeholder
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                className={styles.productImage}
              />
              {product.status && (
                <Box className={styles.productStatus}>
                  {product.status.toUpperCase()}
                </Box>
              )}
            </Box>
            <Typography variant="h6" component="h3">
              {product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {product.category}
            </Typography>
            <Typography variant="h6" color="primary">
              ${product.price}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Container>
  );
}
