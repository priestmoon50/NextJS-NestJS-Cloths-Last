import React, { useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Product } from "@/data/types";
import axios from "axios";
import styles from "./AddProductForm.module.css";

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
      image: undefined, // مقدار پیش‌فرض برای یک یا چند عکس
    },
  });

  useEffect(() => {
    if (initialProduct) {
      reset(initialProduct);
    }
  }, [initialProduct, reset]);

  const onSubmit = async (data: Product) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("description", data.description || "");
      formData.append("category", data.category || "");

      // اگر چندین عکس انتخاب شد، همه را اضافه کن
      if (data.image && data.image.length > 0) {
        Array.from(data.image).forEach((file) => {
          formData.append("image", file); // هر عکس را به فرم‌دیتا اضافه کن
        });
      }

      const colors = data.colors
        ? Array.isArray(data.colors)
          ? data.colors
          : [data.colors]
        : [];
      const sizes = data.sizes
        ? Array.isArray(data.sizes)
          ? data.sizes
          : [data.sizes]
        : [];

      formData.append("colors", colors.join(","));
      formData.append("sizes", sizes.join(","));

      const response = await axios.post(
        "http://localhost:3001/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product added successfully:", response.data);
      reset();
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
      <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Colors (comma-separated)"
            placeholder="red,blue,green"
          />
        )}
      />
      <Controller
        name="sizes"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Sizes (comma-separated)"
            placeholder="S,M,L"
          />
        )}
      />
      <Controller
        name="category"
        control={control}
        render={({ field }) => <TextField {...field} label="Category" />}
      />

      <Controller
        name="image" // همچنان از image استفاده می‌کنیم
        control={control}
        render={({ field }) => (
          <TextField
            type="file"
            inputProps={{ multiple: true }} // اجازه انتخاب چندین فایل
            onChange={(e) =>
              field.onChange(Array.from((e.target as HTMLInputElement).files || []))
            }
          />
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
