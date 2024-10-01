import React from 'react';
import Link from 'next/link';
import { Button, Box, CircularProgress } from '@mui/material';
import styles from '../Register.module.css';

// تعریف prop برای دریافت isSubmitting
const LinkButtons: React.FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => {
  return (
    <Box className={styles.linkButtonRow}>
      {/* دکمه Signup با بررسی isSubmitting */}
      <Button
        type="submit"
        variant="contained"
        className={styles.submitButton}
        disabled={isSubmitting}  // غیرفعال کردن دکمه در هنگام ارسال فرم
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'SignUp'}
      </Button>

      {/* لینک Login */}
      <Link href="/login" passHref>
        <Button variant="text" className={styles.linkButton}>
          Have an account? Login
        </Button>
      </Link>
    </Box>
  );
};

export default LinkButtons;
