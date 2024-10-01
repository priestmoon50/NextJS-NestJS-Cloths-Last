import React from 'react';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import styles from '../Register.module.css';

const NameField: React.FC<{ error: any }> = ({ error }) => {
  const { register } = useFormContext();
  
  return (
    <TextField
      margin="normal"
      fullWidth
      className={styles.nameField}
      label="Full Name"
      {...register('name', { required: 'Name is required' })}
      error={!!error}
      helperText={error ? error.message : ''}
    />
  );
};

export default NameField;
