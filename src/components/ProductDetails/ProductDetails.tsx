import { FC, useState } from "react";
import { Container, Grid, Typography, Box, MenuItem, Select, TextField, Button } from "@mui/material";
import ProductImages from "./ProductImages";
import ProductPrice from "./ProductPrice";
import ProductRating from "./ProductRating";
import { Product } from "@/data/types";
import Link from "next/link";
import styles from "./ProductDetails.module.css"; // ایمپورت فایل CSS module

const ProductDetails: FC<{ product: Product }> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // انتخاب تعداد پیش‌فرض

  const imagesArray = product.images ? product.images : [product.image];

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Box>
        <Link href="/products" passHref>
          <Button variant="outlined" className={styles.backButton}>
            Back to Products
          </Button>
        </Link>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ProductImages images={imagesArray} />
        </Grid>

        <Grid item xs={12} md={6} className={styles.productInfo}>
          <Typography variant="h4" component="h1" className={styles.productTitle}>
            {product.name}
          </Typography>

          <ProductPrice price={product.price} discount={product.discount} />

          {product.rating && product.reviews && (
            <Box sx={{ mt: 2 }}>
              <ProductRating rating={product.rating} reviewsCount={product.reviews.length} />
            </Box>
          )}

          <Typography variant="body2" className={styles.productDescription}>
            {product.description}
          </Typography>

          <Typography variant="body2">
            Category: {product.category || "N/A"}
          </Typography>

          {/* انتخاب سایز */}
          <Box className={styles.selectWrapper}>
            <Typography variant="body2" className={styles.selectLabel}>Select Size:</Typography>
            <Select
              value={selectedSize || ""}
              onChange={(e) => setSelectedSize(e.target.value as string)}
              fullWidth
            >
              {Array.isArray(product.sizes) &&
                product.sizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
            </Select>
          </Box>

          {/* انتخاب رنگ */}
          <Box className={styles.selectWrapper}>
            <Typography variant="body2" className={styles.selectLabel}>Select Color:</Typography>
            <Select
              value={selectedColor || ""}
              onChange={(e) => setSelectedColor(e.target.value as string)}
              fullWidth
            >
              {Array.isArray(product.colors) &&
                product.colors.map((color) => (
                  <MenuItem key={color} value={color}>
                    {color}
                  </MenuItem>
                ))}
            </Select>
          </Box>

          {/* انتخاب تعداد */}
          <Box className={styles.quantityInput}>
            <Typography variant="body2" className={styles.selectLabel}>Quantity:</Typography>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
