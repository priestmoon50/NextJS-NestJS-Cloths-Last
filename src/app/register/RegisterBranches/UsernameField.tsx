import React from 'react';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import styles from '../Register.module.css';

const UsernameField: React.FC<{ error: any }> = ({ error }) => {
  const { register } = useFormContext();
  
  return (
    <TextField
      margin="normal"
      fullWidth
      className={styles.usernameField}
      label="Username"
      {...register('username', { required: 'Username is required' })}
      error={!!error}
      helperText={error ? error.message : ''}
    />
  );
};

export default UsernameField;