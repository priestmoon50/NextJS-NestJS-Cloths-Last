'use client';

import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const LanguageSelector = () => {
  const { i18n } = useTranslation(); // دسترسی به i18n برای تغییر زبان
  const [open, setOpen] = useState(true);

  const handleLanguageChange = (locale: string) => {
    i18n.changeLanguage(locale); // تغییر زبان بدون تغییر URL
    setOpen(false); // بستن مودال بعد از انتخاب زبان
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Select your language
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleLanguageChange('en')}>
            English
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleLanguageChange('fa')}>
            فارسی
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleLanguageChange('fr')}>
            Français
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleLanguageChange('de')}>
            Deutsch
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleLanguageChange('es')}>
            Español
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LanguageSelector;
