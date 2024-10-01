"use client";

import React from 'react';
import { Box, Container, TextField, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginFormInputs } from '@/data/types';
import PasswordField from '@/app/login/LoginBranches/PasswordField';
import SubmitButton from '@/app/login/LoginBranches/SubmitButton';
import LinkButtons from '@/app/login/LoginBranches/LinkButtons';
import LoginDescription from '@/app/login/LoginBranches/LoginDescription'; 
import styles from '@/app/login/Login.module.css';

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      console.log(data);
    } catch (error) {
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
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                autoComplete="email"
                {...register('email', { 
                  required: 'Email is required', 
                  pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' } 
                })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
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
