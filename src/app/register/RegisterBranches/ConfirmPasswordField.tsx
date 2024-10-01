import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormContext, useWatch } from 'react-hook-form';
import styles from '../Register.module.css';

const ConfirmPasswordField: React.FC<{ error: any }> = ({ error }) => {
  const { register, watch } = useFormContext();
  const password = useWatch({ name: 'password' });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <TextField
      margin="normal"
      fullWidth
      className={styles.confirmPasswordField}
      label="Confirm Password"
      type={showPassword ? "text" : "password"}
      {...register('confirmPassword', { 
        required: 'Confirming the password is required', 
        validate: value => value === password || 'Passwords do not match'
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

export default ConfirmPasswordField;
