"use client";

import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { PasswordFieldProps } from '@/data/types';
import styles from '../Login.module.css';  // ایمپورت CSS ماژول

const PasswordField: React.FC<PasswordFieldProps> = ({ label, error, helperText, register }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <TextField
      margin="normal"
      fullWidth
      className={styles.passwordField}  // اضافه کردن استایل از Login.module.css
      label={label}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClickShowPassword}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      error={error}
      helperText={helperText}
      {...register}
    />
  );
};

export default PasswordField;
