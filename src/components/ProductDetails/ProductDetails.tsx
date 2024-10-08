// components/ProductDetails/ProductDetails.tsx
import { FC, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  MenuItem,
  Select,
  TextField,
  Button,
  Modal,
  IconButton,
} from "@mui/material";
import ProductImages from "./ProductImages";
import ProductPrice from "./ProductPrice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Product } from "@/data/types";
import Link from "next/link";
import styles from "./ProductDetails.module.css"; // ایمپورت فایل CSS module
import SizeGuide from "./SizeGuide";

const ProductDetails: FC<{ product: Product }> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // انتخاب تعداد پیش‌فرض
  const [openSizeGuide, setOpenSizeGuide] = useState(false);
  const [liked, setLiked] = useState(false); // وضعیت پسندیدن

  const imagesArray = product.images ? product.images : [product.image];

  const handleOpenSizeGuide = () => setOpenSizeGuide(true);
  const handleCloseSizeGuide = () => setOpenSizeGuide(false);

  // تابع برای تغییر وضعیت پسندیدن
  const toggleLike = () => {
    setLiked((prevLiked) => !prevLiked);
  };

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
          <Typography
            variant="h4"
            component="h1"
            className={styles.productTitle}
          >
            {product.name}
          </Typography>

          <ProductPrice price={product.price} discount={product.discount} />

          {/* آیکون قلب برای افزودن به لیست پسندیده‌ها */}
          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <IconButton onClick={toggleLike}>
              {liked ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon color="error" />
              )}
            </IconButton>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {liked ? "Added to Favorites" : "Add to Favorites"}
            </Typography>
          </Box>

          <Typography variant="body2" className={styles.productDescription}>
            {product.description}
          </Typography>

          <Typography variant="body2">
            Category: {product.category || "N/A"}
          </Typography>

          {/* انتخاب سایز */}
          <Box className={styles.selectWrapper}>
            <Typography variant="body2" className={styles.selectLabel}>
              Select Size:
            </Typography>
            <Select
              value={selectedSize || ""}
              onChange={(e) => setSelectedSize(e.target.value as string)}
              fullWidth
              MenuProps={{
                disableScrollLock: true, // جلوگیری از قفل شدن اسکرول
              }}
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
            <Typography variant="body2" className={styles.selectLabel}>
              Select Color:
            </Typography>
            <Select
              value={selectedColor || ""}
              onChange={(e) => setSelectedColor(e.target.value as string)}
              fullWidth
              MenuProps={{
                disableScrollLock: true, // جلوگیری از قفل شدن اسکرول
              }}
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
            <Typography variant="body2" className={styles.selectLabel}>
              Quantity:
            </Typography>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Box>

          {/* نمایش راهنمای اندازه */}
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleOpenSizeGuide}>
              Size Info
            </Button>
            <Modal
              open={openSizeGuide}
              onClose={handleCloseSizeGuide}
              disableScrollLock={true}
            >
              <Box
                sx={{
                  p: 4,
                  backgroundColor: "white",
                  borderRadius: 2,
                  maxWidth: 400,
                  margin: "auto",
                  mt: "10%",
                }}
              >
                {/* استفاده از داده‌های پویا برای نمایش راهنمای اندازه */}
                {product.sizeGuide && product.sizeGuide.length > 0 ? (
                  <SizeGuide sizeGuide={product.sizeGuide} />
                ) : (
                  <Typography>Sizes are not available!</Typography>
                )}
                <Button onClick={handleCloseSizeGuide} sx={{ mt: 2 }}>
                  بستن
                </Button>
              </Box>
            </Modal>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
