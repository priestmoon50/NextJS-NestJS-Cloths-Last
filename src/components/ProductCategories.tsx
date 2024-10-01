import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface ProductCategoriesProps {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({ setSelectedCategory }) => {
  const [category, setCategory] = useState<string>('all'); // مقدار پیش‌فرض

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setCategory(selectedValue); // ذخیره دسته‌بندی انتخاب‌شده
    setSelectedCategory(selectedValue); // انتقال دسته‌بندی انتخاب‌شده به کامپوننت والد
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Category</InputLabel>
      <Select
        label="Category"
        value={category} // مقدار پیش‌فرض
        onChange={handleCategoryChange} // تغییرات در دسته‌بندی را مدیریت می‌کند
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="men">Men</MenuItem>
        <MenuItem value="women">Women</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ProductCategories;
