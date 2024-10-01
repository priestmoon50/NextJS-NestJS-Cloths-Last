import { FC } from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import ProductImages from "./ProductImages";
import ProductPrice from "./ProductPrice";
import ProductRating from "./ProductRating";
import { Product } from "@/data/types";
import Link from "next/link";

const ProductDetails: FC<{ product: Product }> = ({ product }) => {
  const imagesArray = product.images ? product.images : [product.image];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Link href="/products" passHref>
          <Button variant="outlined" color="primary">
            Back to Products
          </Button>
        </Link>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ProductImages images={imagesArray} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>

          <ProductPrice price={product.price} discount={product.discount} />

          {product.rating && product.reviews && (
            <Box sx={{ mt: 2 }}>
              <ProductRating
                rating={product.rating}
                reviewsCount={product.reviews.length}
              />
            </Box>
          )}

          <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
            {product.description}
          </Typography>

          <Typography variant="body2" gutterBottom>
            Category: {product.category || "N/A"}
          </Typography>

          {/* مدیریت سایزها */}
          <Typography variant="body2" gutterBottom>
            Available Sizes:
            {product.sizes &&
              (Array.isArray(product.sizes)
                ? product.sizes.join(", ")
                : product.sizes)}
            {!product.sizes && "N/A"}
          </Typography>

          <Typography variant="body2" gutterBottom>
            Available Colors:
            {product.colors &&
              (Array.isArray(product.colors)
                ? product.colors.join(", ")
                : product.colors)}
            {!product.colors && "N/A"}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, padding: "10px 20px", fontSize: "16px" }}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
