import React from 'react';
import { Grid } from '@mui/material';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Product } from '@/data/types';

// تابع fetch محصولات
const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get('http://localhost:3001/products');
  return data.map((product: any) => ({
    ...product,
    id: product._id, // تبدیل _id به id
  }));
};

const ProductList: React.FC = () => {
  // دریافت محصولات از API با استفاده از React Query
  const { data: allProducts = [], isLoading, error } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching products</div>;

  return (
    <Grid container spacing={4}>
      {allProducts.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <ProductCard
            id={product.id}           // اضافه کردن id به props
            image={product.image}
            name={product.name}
            price={product.price}
            sizes={product.sizes}      // ارسال اندازه‌ها
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
