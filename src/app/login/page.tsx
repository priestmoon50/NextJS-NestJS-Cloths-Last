"use client";

import React, { useState } from 'react';
import { Box, Container, TextField, Typography, Alert } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginFormInputs } from '@/data/types';
import PasswordField from '@/app/login/LoginBranches/PasswordField';
import SubmitButton from '@/app/login/LoginBranches/SubmitButton';
import LinkButtons from '@/app/login/LoginBranches/LinkButtons';
import LoginDescription from '@/app/login/LoginBranches/LoginDescription';
import { useRouter } from 'next/navigation';  // استفاده از روش جدید
import TokenService from '@/utils/TokenService';  // وارد کردن TokenService
import styles from '@/app/login/Login.module.css';

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();  // استفاده از روش جدید برای ریدایرکت

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to log in. Please check your credentials.');
      }

      const result = await response.json();

      // ذخیره JWT توکن در localStorage با استفاده از TokenService
      TokenService.setToken(result.access_token);  // ذخیره توکن در localStorage
      console.log('Token saved in localStorage:', TokenService.getToken());  // بررسی ذخیره JWT

      setSuccessMessage('Login successful!');
      setErrorMessage(null);

      // ریدایرکت به صفحه محصولات به جای استفاده از asPath
      router.push('/products');
      
    } catch (error) {
      setErrorMessage('Login failed. Please try again.');
      setSuccessMessage(null);
      console.error('Error during login:', error);
    }
  };

  return (
    <div className={styles.backgroundContainer}>
      <Container maxWidth="lg" className={styles.container}>
        <Box className={styles.loginContainer}>
          <Box className={styles.leftColumn}>
            <Typography component="h1" variant="h4">
              Login
            </Typography>
            <Typography component="h1" variant="h6">
              Sign In to your account
            </Typography>

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
              <TextField
                margin="normal"
                fullWidth
                label="Phone Number"
                autoComplete="tel"
                {...register('phone', { 
                  required: 'Phone number is required', 
                  pattern: { value: /^\+?[0-9]{10,15}$/, message: 'Enter a valid phone number' } 
                })}
                error={!!errors.phone}
                helperText={errors.phone ? errors.phone.message : ''}
              />
              <PasswordField
                label="Password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                register={register('password', { required: 'Password is required' })}
              />
              <SubmitButton isSubmitting={isSubmitting} label="Login" />
              <LinkButtons forgotPasswordLink="/forgot-password" registerLink="/register" />
            </Box>
          </Box>

          <Box className={styles.rightColumn}>
            <LoginDescription />
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
