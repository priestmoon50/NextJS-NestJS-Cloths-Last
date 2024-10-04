import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { Product, CartItem } from '@/data/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const ProductCard: React.FC<Product> = ({
  id,
  images,
  name,
  price,
  discount,
}) => {
  const { addItem, updateItem, cart } = useCart();

  // محاسبه قیمت تخفیف‌خورده
  const discountedPrice = discount ? price - (price * discount) / 100 : null;

  // دریافت آرایه تصاویر
  const imagesArray = images ? images : [];

  const itemInCart = cart.items.find((item: CartItem) => item.id === id.toString());

  const handleAddToCart = () => {
    if (itemInCart) {
      updateItem(id.toString(), itemInCart.quantity + 1);
    } else {
      addItem({
        id: id.toString(),
        name,
        price: discountedPrice || price,
        quantity: 1,
        size: 'N/A',
        color: 'N/A',
      });
    }
  };

  return (
    <motion.div
      id={`product-${id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card sx={{ position: 'relative', overflow: 'hidden' }}>
        <Image
          src={imagesArray.length > 0 ? imagesArray[0] : '/placeholder.jpg'}
          alt={name}
          width={500}
          height={300}
          style={{ width: '100%', height: 'auto' }}
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
                    textDecoration: 'line-through',
                    fontSize: { xs: '1rem', sm: '0.875rem' },
                  }}
                >
                  ${price}
                </Typography>
                <Typography
                  variant="body2"
                  color="error"
                  sx={{
                    fontSize: { xs: '1.25rem', sm: '1rem' },
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
            <Grid item xs={12} sm={6}>
              <Link href={`/product/${id}`} passHref>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    padding: { xs: '1px 8px', sm: '8px 12px' },
                    fontSize: { xs: '0.75rem', sm: '0.775rem' },
                    borderRadius: '4px',
                  }}
                >
                  View Details
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleAddToCart}
                sx={{
                  padding: { xs: '1px 8px', sm: '8px 12px' },
                  fontSize: { xs: '0.75rem', sm: '0.775rem' },
                  borderRadius: '4px',
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