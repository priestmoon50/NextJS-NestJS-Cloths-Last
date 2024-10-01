"use client";

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { RegisterFormInputs } from '@/data/types';
import NameField from '@/app/register/RegisterBranches/NameField';
import EmailField from '@/app/register/RegisterBranches/EmailField';
import PasswordField from '@/app/register/RegisterBranches/PasswordField';
import ConfirmPasswordField from '@/app/register/RegisterBranches/ConfirmPasswordField';
import LinkButtons from '@/app/register/RegisterBranches/LinkButtons';
import styles from '@/app/register/Register.module.css';  // ایمپورت CSS ماژول

const Register: React.FC = () => {
  const methods = useForm<RegisterFormInputs>();
  const { handleSubmit, formState: { errors, isSubmitting } } = methods;

  const onSubmit = async (data: RegisterFormInputs) => {
    console.log(data);
    // ارسال به سرور
  };

  return (
    <div className={styles.backgroundContainer}>
      <Container component="main" maxWidth="xs">
        <Box className={styles.container}>
          <Typography component="h1" variant="h4">
            Signup
          </Typography>
          <FormProvider {...methods}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
              <NameField error={errors.name} />
              <EmailField error={errors.email} />
              <PasswordField error={errors.password} label="Password" />
              <ConfirmPasswordField error={errors.confirmPassword} />
              {/* ارسال isSubmitting به LinkButtons */}
              <LinkButtons isSubmitting={isSubmitting} />
            </Box>
          </FormProvider>
        </Box>
      </Container>
    </div>
  );
};

export default Register;
