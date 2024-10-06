import React from 'react';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import styles from '../Register.module.css';

const PhoneNumberField: React.FC<{ error: any }> = ({ error }) => {
  const { register } = useFormContext();
  
  return (
    <TextField
      margin="normal"
      fullWidth
      className={styles.phoneNumberField}
      label="Phone Number"
      autoComplete="tel"
      {...register('phone', { 
        required: 'Phone number is required', 
        pattern: { value: /^[+\d][\d\s().-]{6,20}$/, message: 'Please enter a valid phone number' }
      })}
      error={!!error}
      helperText={error ? error.message : ''}
    />
  );
};

export default PhoneNumberField;
