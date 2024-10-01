import React, { useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Product } from "@/data/types";
import axios from 'axios'; // اضافه کردن axios
import styles from "./AddProductForm.module.css";

interface AddProductFormProps {
  onAddProduct: (product: Product) => void;
  initialProduct?: Product; // prop برای ویرایش محصول
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  onAddProduct,
  initialProduct,
}) => {
  const { control, handleSubmit, reset } = useForm<Product>({
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      colors: [], // تغییر به colors
      sizes: [],  // تغییر به sizes
      category: "",
    },
  });

  useEffect(() => {
    if (initialProduct) {
      reset(initialProduct); // پر کردن فرم با محصول مورد ویرایش
    }
  }, [initialProduct, reset]);

  // تابع ارسال محصول به بک‌اند
  const onSubmit = async (data: Product) => {
    try {
      const response = await axios.post('http://localhost:3001/products', {
        ...data,
        colors: typeof data.colors === 'string' ? data.colors.split(',') : data.colors,
        sizes: typeof data.sizes === 'string' ? data.sizes.split(',') : data.sizes,
      });
      console.log('Product added successfully:', response.data);
      reset(); // ریست کردن فرم بعد از ارسال موفقیت‌آمیز
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.formContainer}
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: "Product name is required" }}
        render={({ field }) => (
          <TextField {...field} label="Product Name" required />
        )}
      />
      <Controller
        name="price"
        control={control}
        rules={{ required: "Price is required", min: 0 }}
        render={({ field }) => (
          <TextField {...field} label="Price" type="number" required />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Description" multiline rows={4} />
        )}
      />
      <Controller
        name="colors" // تغییر از color به colors
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Colors (comma-separated)" placeholder="red,blue,green" />
        )}
      />
      <Controller
        name="sizes" // تغییر از size به sizes
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Sizes (comma-separated)" placeholder="S,M,L" />
        )}
      />
      <Controller
        name="category"
        control={control}
        render={({ field }) => <TextField {...field} label="Category" />}
      />
      <Button
        className={styles.buttonClass}
        type="submit"
        variant="contained"
        color="primary"
      >
        {initialProduct ? "Update Product" : "Add Product"}
      </Button>
    </Box>
  );
};

export default AddProductForm;
