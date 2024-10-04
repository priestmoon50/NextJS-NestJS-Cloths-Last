import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Grid, Select, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Product } from "@/data/types";
import axios from "axios";
import styles from "./AddProductForm.module.css";
import GalleryImageSelector from './GalleryImageSelector'; // وارد کردن GalleryImageSelector برای انتخاب عکس از گالری

interface AddProductFormProps {
  onAddProduct: (product: Product) => void;
  initialProduct?: Product;
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
      colors: [],
      sizes: [],
      category: "",
      images: [], // آرایه برای ذخیره URL تصاویر انتخاب‌شده
    },
  });

  const [addedImages, setAddedImages] = useState<string[]>([]); // ذخیره URL تصاویر انتخاب‌شده
  const availableSizes = ["S", "M", "L", "XL", "2X Large"];
  const availableColors = ["Red", "Blue", "Green", "Yellow"];

  useEffect(() => {
    if (initialProduct) {
      reset(initialProduct);
    }
  }, [initialProduct, reset]);
  
  // اضافه کردن تصویر انتخاب‌شده به لیست تصاویر محصول
  const handleAddImage = (imageUrl: string) => {
    setAddedImages([...addedImages, imageUrl]);
  };

  const onSubmit = async (data: Product) => {
    try {
      const productData = {
        ...data,
        images: addedImages, // اضافه کردن URL تصاویر به داده‌های محصول
      };

      // ارسال داده به بک‌اند به صورت JSON
      const response = await axios.post("http://localhost:3001/products", productData);
      
      console.log("Product added successfully:", response.data);
      reset();
      setAddedImages([]); // پاک کردن تصاویر انتخاب‌شده بعد از افزودن محصول
    } catch (error) {
      console.error("Error adding product:", error);
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

      {/* انتخاب رنگ‌ها */}
      <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            multiple
            value={field.value || []}
            onChange={field.onChange}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {availableColors.map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      {/* انتخاب سایزها */}
      <Controller
        name="sizes"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            multiple
            value={field.value || []}
            onChange={field.onChange}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {availableSizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => <TextField {...field} label="Category" />}
      />

      {/* اضافه کردن GalleryImageSelector برای انتخاب عکس */}
      <GalleryImageSelector onAddImage={handleAddImage} />

      {/* نمایش تصاویر انتخاب‌شده */}
      <Box sx={{ marginTop: '20px' }}>
        <Typography variant="h6">Selected Images for this Product:</Typography>
        <Grid container spacing={2}>
          {addedImages.map((image, index) => (
            <Grid item xs={2} key={index}>
              <img
                src={image}
                alt={`Selected Image ${index}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

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
