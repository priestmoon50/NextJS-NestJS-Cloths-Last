import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';
import styles from '../Register.module.css';

const PasswordField: React.FC<{ error: any; label: string }> = ({ error, label }) => {
  const { register } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <TextField
      margin="normal"
      fullWidth
      className={styles.passwordField}
      label={label}
      type={showPassword ? "text" : "password"}
      {...register('password', { 
        required: 'Password is required', 
        minLength: { value: 8, message: 'Password must be at least 8 characters long' }
      })}
      error={!!error}
      helperText={error ? error.message : ''}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClickShowPassword}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
