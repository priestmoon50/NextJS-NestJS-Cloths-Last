// src/components/ProductFilters.tsx

import React, { useState } from 'react';
import { Slider, Typography } from '@mui/material';

const ProductFilters: React.FC<{ setPriceRange: (range: number[]) => void }> = ({ setPriceRange }) => {
  const [value, setValue] = useState<number[]>([10, 100]);

  const handlePriceChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[]);
    setPriceRange(newValue as number[]);
  };

  return (
    <>
      <Typography>Price Range</Typography>
      <Slider
        value={value}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={200}
      />
    </>
  );
};

export default ProductFilters;
