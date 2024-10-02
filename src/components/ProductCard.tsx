import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";
import Image from "next/image";
import { Product } from "@/data/types";
import { motion } from "framer-motion";
import Link from "next/link"; // ایمپورت لینک برای روتینگ

const ProductCard: React.FC<Product> = ({
  id,
  images,
  name,
  price,
  discount,
}) => {
  // محاسبه قیمت تخفیف‌خورده
  const discountedPrice = discount ? price - (price * discount) / 100 : null;

  // دریافت آرایه تصاویر
  const imagesArray = images ? images : [];

  return (
    <motion.div
      id={`product-${id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card sx={{ position: "relative", overflow: "hidden" }}>
        <Image
          src={imagesArray.length > 0 ? `http://localhost:3000${imagesArray[0]}` : "/placeholder.jpg"}
          alt={name}
          width={500}
          height={300}
          style={{ width: "100%", height: "auto" }}
          priority={true}
        />

        <CardContent>
          <Typography variant="h6" component="div">
            {name}
          </Typography>
          <Box>
            {discountedPrice ? (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "line-through",
                    fontSize: { xs: "1rem", sm: "0.875rem" }, // بزرگ‌تر در موبایل، کوچک‌تر در دسکتاپ
                  }}
                >
                  ${price}
                </Typography>
                <Typography
                  variant="body2"
                  color="error"
                  sx={{
                    fontSize: { xs: "1.25rem", sm: "1rem" }, // قیمت با تخفیف بزرگ‌تر در موبایل
                  }}
                >
                  ${discountedPrice}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                ${price}
              </Typography>
            )}
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* دکمه‌های ریسپانسیو و شیک‌تر */}
            <Grid item xs={12} sm={6}>
              <Link href={`/product/${id}`} passHref>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    padding: { xs: "1px 8px", sm: "8px 12px" }, // تغییر اندازه padding برای موبایل و دسکتاپ
                    fontSize: { xs: "0.75rem", sm: "0.775rem" }, // تغییر اندازه فونت برای موبایل و دسکتاپ
                    borderRadius: "4px",
                  }}
                >
                  View Details
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{
                  padding: { xs: "1px 8px", sm: "8px 12px" }, // تغییر اندازه padding برای موبایل و دسکتاپ
                  fontSize: { xs: "0.75rem", sm: "0.775rem" }, // تغییر اندازه فونت برای موبایل و دسکتاپ
                  borderRadius: "4px",
                }}
              >
                Add to Cart
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default React.memo(ProductCard);
