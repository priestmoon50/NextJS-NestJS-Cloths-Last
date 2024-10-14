"use client";

import React from "react";
import { useFavorites } from "@/context/FavoriteContext";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import Link from "next/link";

const FavoritesPage = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Favorite Products
      </Typography>

      {favorites.items.length === 0 ? (
        <Typography variant="body1">
          You have no favorite products yet.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {favorites.items.map((product) => (
            <Grid item xs={12} md={4} key={product.id}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: 2,
                  borderRadius: 4,
                  textAlign: "center",
                }}
              >
                <img
                  src={product.imageUrl || "/images/default-product.jpg"} // استفاده از تصویر پیش‌فرض
                  alt={product.name}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />

                <Typography variant="h6" component="h2" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body1">${product.price}</Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => removeFavorite(product.id.toString())}
                  sx={{ mt: 2 }}
                >
                  Remove from Favorites
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4 }}>
        <Link href="/products" passHref>
          <Button variant="contained" color="primary">
            Back to Products
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default FavoritesPage;
