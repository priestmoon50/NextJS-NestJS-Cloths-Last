// src/admin/products/AddProductForm.tsx
import React, { useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Product } from "@/data/types";
import styles from "./AddProductForm.module.css"; // اضافه کردن CSS Module

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
      id: Math.random(),
      name: "",
      price: 0,
      image: "",
      category: "",
      stock: 0,
    },
  });

  useEffect(() => {
    if (initialProduct) {
      reset(initialProduct); // پر کردن فرم با محصول مورد ویرایش
    }
  }, [initialProduct, reset]);

  const onSubmit = (data: Product) => {
    onAddProduct({ ...data, id: Math.random() });
    reset(); // بعد از افزودن محصول، فرم را ریست کن
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.formContainer} // استفاده از CSS Module
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
        name="image"
        control={control}
        render={({ field }) => <TextField {...field} label="Image URL" />}
      />
      <Controller
        name="category"
        control={control}
        render={({ field }) => <TextField {...field} label="Category" />}
      />
      <Controller
        name="stock"
        control={control}
        rules={{ required: "Stock is required", min: 0 }}
        render={({ field }) => (
          <TextField {...field} label="Stock" type="number" required />
        )}
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
