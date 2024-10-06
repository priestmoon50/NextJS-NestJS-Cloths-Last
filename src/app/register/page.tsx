"use client";


import { useState } from "react";
import { Box, Typography, Container, Alert, CircularProgress } from "@mui/material";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { RegisterFormInputs } from "@/data/types";
import UsernameField from "@/app/register/RegisterBranches/UsernameField";
import PasswordField from "@/app/register/RegisterBranches/PasswordField";
import ConfirmPasswordField from "@/app/register/RegisterBranches/ConfirmPasswordField";
import LinkButtons from "@/app/register/RegisterBranches/LinkButtons";
import styles from "@/app/register/Register.module.css";

const Register: React.FC<{ phone: string }> = ({ phone }) => {
  const methods = useForm<RegisterFormInputs>();
  const { handleSubmit, formState: { errors, isSubmitting }, reset } = methods;
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setLoading(true); // شروع بارگذاری
    setError(null);  // پاک کردن پیام خطا در ابتدا
    setMessage(null); // پاک کردن پیام موفقیت

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, phone }),  // ارسال شماره تلفن همراه اطلاعات
      });

      if (!response.ok) throw new Error("Failed to register user");

      const result = await response.json();
      setMessage("User registered successfully!"); // نمایش پیام موفقیت
      reset(); // ریست کردن فرم
    } catch (error) {
      setError("Error during registration. Please try again.");
    } finally {
      setLoading(false); // توقف بارگذاری
    }
  };

  return (
    <div className={styles.backgroundContainer}>
      <Container component="main" maxWidth="xs">
        <Box className={styles.container}>
          <Typography component="h1" variant="h4">
            Register
          </Typography>

          {/* نمایش پیام‌های موفقیت و خطا */}
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
              <PasswordField error={errors.password} label="Password" />
              <ConfirmPasswordField error={errors.confirmPassword} />

              <Box className={styles.buttonContainer}>
                <LinkButtons isSubmitting={isSubmitting || loading} />
                {loading && <CircularProgress size={24} className={styles.progress} />} {/* نمایش بارگذاری */}
              </Box>
            </Box>
          </FormProvider>
        </Box>
      </Container>
    </div>
  );
};

export default Register;
