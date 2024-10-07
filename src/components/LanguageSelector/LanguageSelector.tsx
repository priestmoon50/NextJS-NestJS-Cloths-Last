'use client';

import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(true);

  const handleLanguageChange = (locale: string) => {
    i18n.changeLanguage(locale);
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 300, sm: 400 }, // تنظیم اندازه مودال برای موبایل و دسکتاپ
          bgcolor: 'background.paper',
          borderRadius: 3, // گوشه‌های گردتر
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)', // سایه زیبا
          p: { xs: 3, sm: 4 }, // فاصله‌های داخلی بر اساس سایز
          textAlign: 'center',
          transition: 'all 0.3s ease', // اضافه کردن انیمیشن به مودال
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Select Your Language
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please choose your preferred language
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2, // فاصله‌ی بین دکمه‌ها
            flexWrap: 'wrap', // برای موبایل چینش مناسب دکمه‌ها
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 50, // دکمه‌های گردتر
              padding: '8px 16px',
              fontSize: '0.875rem',
            }}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              borderRadius: 50,
              padding: '8px 16px',
              fontSize: '0.875rem',
            }}
            onClick={() => handleLanguageChange('fa')}
          >
            فارسی
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 50,
              padding: '8px 16px',
              fontSize: '0.875rem',
            }}
            onClick={() => handleLanguageChange('fr')}
          >
            Français
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              borderRadius: 50,
              padding: '8px 16px',
              fontSize: '0.875rem',
            }}
            onClick={() => handleLanguageChange('de')}
          >
            Deutsch
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 50,
              padding: '8px 16px',
              fontSize: '0.875rem',
            }}
            onClick={() => handleLanguageChange('es')}
          >
            Español
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LanguageSelector;
