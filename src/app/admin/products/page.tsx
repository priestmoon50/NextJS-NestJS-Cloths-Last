// src/admin/products/page.tsx
'use client';

import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import ProductsList from './ProductsList';
import AddProductForm from './AddProductForm';
import { Product } from '@/data/types';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'T-Shirt',
      price: 25.99,
      image: '/images/tshirt.jpg',
      category: 'Clothing',
      stock: 50,
    },
    {
      id: 2,
      name: 'Jeans',
      price: 49.99,
      image: '/images/jeans.jpg',
      category: 'Clothing',
      stock: 30,
    },
  ]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setEditingProduct(null);
  };

  return (
    <Container sx={{ marginTop: '100px' }}> {/* اضافه کردن فاصله 100px از بالا */}
      <Typography color='white' variant="h4" gutterBottom>
        Products Management
      </Typography>
      {editingProduct ? (
        <AddProductForm
          onAddProduct={handleUpdateProduct}
          initialProduct={editingProduct}
        />
      ) : (
        <AddProductForm onAddProduct={handleAddProduct} />
      )}
      <ProductsList
        onDeleteProduct={handleDeleteProduct}
        onEditProduct={handleEditProduct}
      />
    </Container>
  );
};

export default ProductsPage;
