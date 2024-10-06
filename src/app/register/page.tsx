"use client";

import React, { useState } from "react";
import { Box, Typography, Container, Alert } from "@mui/material";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { RegisterFormInputs } from "@/data/types";
import UsernameField from "@/app/register/RegisterBranches/UsernameField";
import PhoneNumberField from "@/app/register/RegisterBranches/PhoneNumberField";
import PasswordField from "@/app/register/RegisterBranches/PasswordField";
import ConfirmPasswordField from "@/app/register/RegisterBranches/ConfirmPasswordField";
import LinkButtons from "@/app/register/RegisterBranches/LinkButtons";
import styles from "@/app/register/Register.module.css"; // ایمپورت CSS ماژول

const Register: React.FC = () => {
  const methods = useForm<RegisterFormInputs>();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    // حذف فیلد confirmPassword پیش از ارسال به سرور
    const { confirmPassword, ...userData } = data;

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      const result = await response.json();
      setMessage("User registered successfully!");
      setError(null);
      console.log("User registered successfully:", result);
    } catch (error) {
      setError("Error during registration. Please try again.");
      setMessage(null);
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className={styles.backgroundContainer}>
      <Container component="main" maxWidth="xs">
        <Box className={styles.container}>
          <Typography component="h1" variant="h4">
            Signup
          </Typography>

          {/* نمایش پیام‌ها */}
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <FormProvider {...methods}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className={styles.form}
            >
              <UsernameField error={errors.username} />
              <PhoneNumberField error={errors.phone} />
              <PasswordField error={errors.password} label="Password" />
              <ConfirmPasswordField error={errors.confirmPassword} />
              <LinkButtons isSubmitting={isSubmitting} />
            </Box>
          </FormProvider>
        </Box>
      </Container>
    </div>
  );
};

export default Register;
