'use client';  // اطمینان حاصل کنید که کامپوننت کلاینتی است

import { Box, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';  // از next/navigation استفاده کنید

const categories = [
  { id: 1, title: 'Accessory', image: '/Accessory.webp', filter: 'pants' },
  { id: 2, title: 'Dresses', image: '/piran.webp', filter: 'dresses' },
  { id: 3, title: 'Shoes', image: '/shos.webp', filter: 'jackets' },
  { id: 4, title: 'Pants', image: '/shalvar.webp', filter: 'footwear' },
];

export default function CategoryLinks() {
  const router = useRouter();
  const handleCategoryClick = (filter: string) => {
    router.push(`/products?category=${filter}`);  // هدایت به صفحه فیلتر شده
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.id}>
            <Box
              onClick={() => handleCategoryClick(category.filter)}
              sx={{
                cursor: 'pointer',
                position: 'relative',
                height: '300px',
                background: "cover",
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0px 2px 12px rgba(0, 221, 250, 0.637)',
                border: '1px solid rgba(11, 14, 209, 0.829)', // اضافه کردن حاشیه به دور تصویر
                transition: 'transform 0.3s ease', // برای جلوه hover
                '&:hover': {
                  transform: 'scale(1.05)', // تغییر سایز در حالت hover
                  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                style={{ objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  textAlign: 'center',
                  py: 1,
                }}
              >
                <Typography variant="h6">{category.title}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
