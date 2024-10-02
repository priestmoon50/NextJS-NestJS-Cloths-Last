import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, Button } from '@mui/material';

interface GalleryImageSelectorProps {
  onAddImage: (imageUrl: string) => void; // تابع برای اضافه کردن URL تصویر به محصول
}

const GalleryImageSelector: React.FC<GalleryImageSelectorProps> = ({ onAddImage }) => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // دریافت لیست تصاویر از API بک‌اند
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/gallery'); // آدرس بک‌اند برای دریافت لیست تصاویر
        setImages(response.data); // ذخیره لیست URL تصاویر در state
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  // مدیریت انتخاب تصویر
  const handleImageSelect = (image: string) => {
    setSelectedImage(image); // ذخیره تصویر انتخاب‌شده
  };

  // افزودن تصویر به محصول
  const handleAddImage = () => {
    if (selectedImage) {
      onAddImage(selectedImage); // ارسال تصویر انتخاب‌شده به والد
    }
  };

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Select an Image from Gallery
      </Typography>

      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={2} key={index}>
            <img
              src={image} // نمایش تصویر از URL
              alt={`Gallery Image ${index}`}
              style={{
                width: '100px', // اندازه کوچک تصویر
                height: '100px',
                cursor: 'pointer',
                border: selectedImage === image ? '2px solid blue' : 'none', // استایل برای تصویر انتخاب‌شده
                objectFit: 'cover', // یکسان کردن نسبت تصاویر
              }}
              onClick={() => handleImageSelect(image)} // انتخاب تصویر
            />
          </Grid>
        ))}
      </Grid>

      {selectedImage && (
        <Box mt={2}>
          <Typography variant="h6">Selected Image:</Typography>
          <img 
            src={selectedImage} 
            alt="Selected" 
            style={{ width: '300px', height: 'auto' }} // نمایش تصویر انتخاب شده با سایز بزرگ
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddImage}
            sx={{ marginLeft: '20px' }}
          >
            Add
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GalleryImageSelector;
