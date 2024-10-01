import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { SubmitButtonProps } from '@/data/types';
import styles from '../Login.module.css';

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, label }) => {
  return (
    <Box className={styles.buttonContainer}> {/* ظرف برای دکمه و لینک */}
      <Button
        type="submit"
        variant="contained"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : label}
      </Button>
      <a href="/ForgotPasswordForm" className={styles.forgotPassword}> {/* لینک کنار دکمه */}
        Forget Password?
      </a>
    </Box>
  );
};

export default SubmitButton;
