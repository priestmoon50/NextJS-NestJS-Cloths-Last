'use client';

import { Container, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import Slider from "react-slick";
import styles from "./ProductGrid.module.css";

interface Product {
  id: number;
  title: string;
  image: string;
  category: string;
  price: string;
  status?: "new" | "upcoming";
}

const products: Product[] = [
  { id: 1, title: "Red Dress", image: "/1.jpg", category: "Dresses", price: "$89.99", status: "new" },
  { id: 2, title: "Leather Jacket", image: "/2.jpg", category: "Jackets", price: "$129.99", status: "new" },
  { id: 3, title: "Blue Jeans", image: "/3.jpg", category: "Jeans", price: "$59.99", status: "new" },
  { id: 4, title: "Black T-Shirt", image: "/4.jpg", category: "T-Shirts", price: "$24.99", status: "new" },
  { id: 5, title: "White Sneakers", image: "/5.jpg", category: "Footwear", price: "$79.99", status: "upcoming" },
  { id: 6, title: "Floral Skirt", image: "/6.jpg", category: "Skirts", price: "$49.99" },
  { id: 7, title: "Wool Sweater", image: "/7.jpg", category: "Sweaters", price: "$69.99" },
  { id: 8, title: "Summer Hat", image: "/8.jpg", category: "Accessories", price: "$19.99" },
  { id: 9, title: "Sports Shorts", image: "/9.jpg", category: "Shorts", price: "$29.99" },
  { id: 10, title: "Classic Watch", image: "/10.jpg", category: "Accessories", price: "$199.99" },
  { id: 11, title: "Sports test", image: "/11.jpg", category: "Shorts", price: "$292.99" },
  { id: 12, title: "Classic cloth", image: "/12.jpg", category: "Accessories", price: "$659.99" },
];

export default function ProductGrid() {
  const theme = useTheme();
  
  // استفاده از Media Query برای تنظیمات اسلایدر
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // برای نسخه‌های موبایل
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // برای تبلت‌ها
  
  // تنظیمات اسلایدر بر اساس سایز صفحه
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 2 : isTablet ? 3 : 6, // تعداد محصولات بر اساس سایز صفحه
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
                src={product.image}
                alt={product.title}
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
              {product.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {product.category}
            </Typography>
            <Typography variant="h6" color="primary">
              {product.price}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Container>
  );
}
