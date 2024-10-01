import React from 'react';
import { TextField } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const UsernameField: React.FC = () => {
  return (
    <TextField
      fullWidth
      label="Username"
      InputProps={{
        startAdornment: (
          <AccountCircle />
        ),
      }}
    />
  );
};

export default UsernameField;
