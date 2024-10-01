import React from 'react';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import styles from '../Register.module.css';

const EmailField: React.FC<{ error: any }> = ({ error }) => {
  const { register } = useFormContext();
  
  return (
    <TextField
      margin="normal"
      fullWidth
      className={styles.emailField}
      label="Email"
      autoComplete="email"
      {...register('email', { 
        required: 'Email is required', 
        pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' }
      })}
      error={!!error}
      helperText={error ? error.message : ''}
    />
  );
};

export default EmailField;
