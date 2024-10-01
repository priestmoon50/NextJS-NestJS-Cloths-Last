// components/ProductDetails/ProductRating.tsx
import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { ProductRatingProps } from '@/data/types'; // ایمپورت تایپ

const ProductRating: FC<ProductRatingProps> = ({ rating, reviewsCount }) => {
  
  // تابع برای رندر کردن ستاره‌ها
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    return (
      <>
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ mx: 0.5 }}>
            {index < fullStars ? <StarIcon color="primary" /> : <StarBorderIcon color="primary" />}
          </Box>
        ))}
        {halfStar && (
          <Box sx={{ mx: 0.5 }}>
            <StarIcon color="primary" />
          </Box>
        )}
      </>
    );
  };

  return (
    <Box display="flex" alignItems="center">
      {/* فراخوانی تابع رندر ستاره‌ها */}
      {renderStars(rating)}

      <Typography variant="body2" sx={{ ml: 1 }}>
        ({reviewsCount} reviews)
      </Typography>
    </Box>
  );
};

export default ProductRating;
