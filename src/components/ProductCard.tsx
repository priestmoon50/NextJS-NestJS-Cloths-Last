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
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick'; // اضافه کردن اسلایدر

const ProductCard: React.FC<Product> = ({
  id,
  images,
  name,
  price,
  discount,
  sizes,
  colors,
}) => {
  const { t } = useTranslation();
  const { addItem, updateItem, cart } = useCart();
  
  const discountedPrice = discount ? price - (price * discount) / 100 : null;
  const imagesArray = images ? images : [];

  const [selectedSize, setSelectedSize] = useState<string | number>('');
  const [selectedColor, setSelectedColor] = useState<string | number>('');

  const itemInCart = cart.items.find((item: CartItem) => item.id === id.toString());

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert(t('pleaseSelectSizeAndColor'));
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
        size: String(selectedSize),
        color: String(selectedColor),
      });
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
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
          {imagesArray.length > 1 ? (
            <Slider {...sliderSettings}>
              {imagesArray.map((img, index) => (
                <Box key={index} sx={{ position: 'relative', width: '100%', height: '300px' }}>
                  <Image
                    src={img}
                    alt={`${name}-${index}`}
                    layout="fill"
                    objectFit="cover"
                    priority={index === 0}
                  />
                </Box>
              ))}
            </Slider>
          ) : (
            <Image
              src={imagesArray[0] || '/placeholder.jpg'}
              alt={name}
              layout="fill"
              objectFit="cover"
              priority={true}
            />
          )}
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

          {/* انتخاب سایز به صورت دکمه‌های کوچک‌تر */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {Array.isArray(sizes) && sizes.map((size) => (
              <Box
                key={size}
                onClick={() => setSelectedSize(size)}
                sx={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: selectedSize === size ? '2px solid black' : '1px solid gray',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {size}
              </Box>
            ))}
          </Box>

          {/* انتخاب رنگ به صورت دایره‌ای */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {Array.isArray(colors) && colors.map((color) => (
              <Box
                key={color}
                onClick={() => setSelectedColor(color)}
                sx={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: selectedColor === color ? '2px solid black' : '1px solid gray',
                  cursor: 'pointer',
                }}
              />
            ))}
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
