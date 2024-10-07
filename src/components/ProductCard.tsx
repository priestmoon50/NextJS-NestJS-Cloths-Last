import React, { useState } from 'react';
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
import { useTranslation } from 'react-i18next';  // اضافه کردن i18next
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material'; // برای انتخاب سایز و رنگ

const ProductCard: React.FC<Product> = ({
  id,
  images,
  name,
  price,
  discount,
  sizes,
  colors, // اضافه کردن سایز و رنگ
}) => {
  const { t } = useTranslation();  // استفاده از hook ترجمه
  const { addItem, updateItem, cart } = useCart();
  
  // محاسبه قیمت تخفیف‌خورده
  const discountedPrice = discount ? price - (price * discount) / 100 : null;
  const imagesArray = images ? images : [];

  // استیت‌ها برای ذخیره سایز و رنگ انتخاب‌شده توسط کاربر
  const [selectedSize, setSelectedSize] = useState<string | number>('');
  const [selectedColor, setSelectedColor] = useState<string | number>('');

  const itemInCart = cart.items.find((item: CartItem) => item.id === id.toString());

  // افزودن محصول به سبد خرید با سایز و رنگ انتخاب‌شده
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert(t('pleaseSelectSizeAndColor'));  // هشدار برای انتخاب سایز و رنگ
      return;
    }
  
    if (itemInCart) {
      updateItem(id.toString(), itemInCart.quantity + 1);
    } else {
      addItem({
        id: id.toString(),
        name,
        price: discountedPrice || price,
        quantity: 1,
        size: String(selectedSize),  // تبدیل به string
        color: String(selectedColor), // تبدیل به string
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
      <Card sx={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
        <Box sx={{ width: '100%', height: '300px', position: 'relative' }}>
          <Image
            src={imagesArray.length > 0 ? imagesArray[0] : '/placeholder.jpg'}
            alt={name}
            layout="fill"
            objectFit="cover"
            priority={true}
          />
        </Box>

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
                  {t('price')}: ${price}
                </Typography>
                <Typography
                  variant="body2"
                  color="error"
                  sx={{
                    fontSize: { xs: '1.25rem', sm: '1rem' },
                  }}
                >
                  {t('discountedPrice')}: ${discountedPrice}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('price')}: ${price}
              </Typography>
            )}
          </Box>

          {/* انتخاب سایز */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{t('size')}</InputLabel>
            <Select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {Array.isArray(sizes) && sizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* انتخاب رنگ */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{t('color')}</InputLabel>
            <Select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              {Array.isArray(colors) && colors.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
                  {t('viewDetails')}
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
                {t('addToCart')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default React.memo(ProductCard);
