import React from "react";
import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "@/data/types";

// تابع fetch محصولات
const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get("http://localhost:3001/products");

  // بررسی اینکه آیا API لیستی از محصولات را برمی‌گرداند
  if (Array.isArray(data)) {
    return data.map((product: any) => ({
      ...product,
      id: product._id, // تبدیل _id به id
    }));
  } else {
    console.error("Error: API did not return an array");
    return [];
  }
};

const ProductList: React.FC = () => {
  // دریافت محصولات از API با استفاده از React Query
  const { data: allProducts = [], isLoading, error } = useQuery<
    Product[],
    Error
  >({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching products</div>;

  return (
    <Grid container spacing={4}>
      {allProducts.length > 0 ? (
        allProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <ProductCard
              id={product.id}
              _id={product._id}
              image={product.images?.[0] || "/placeholder.jpg"} // استفاده از اولین تصویر یا placeholder
              name={product.name}
              price={product.price}
              discount={product.discount}
              sizes={product.sizes}
              description={product.description} // اضافه کردن توضیحات
              category={product.category} // اضافه کردن کتگوری
              colors={product.colors} // اضافه کردن رنگ‌ها
            />
          </Grid>
        ))
      ) : (
        <div>No products available</div>
      )}
    </Grid>
  );
};

export default ProductList;
