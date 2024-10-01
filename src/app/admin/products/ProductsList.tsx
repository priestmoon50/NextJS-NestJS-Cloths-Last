// src/admin/products/ProductsList.tsx

'use client';

import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Product } from '@/data/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import styles from './ProductsList.module.css'; // اضافه کردن CSS Module

interface ProductsListProps {
  onDeleteProduct: (id: number) => void;
  onEditProduct: (product: Product) => void;
}

// تابع fetch برای دریافت محصولات از API
const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get('http://localhost:3001/products');
  return data.map((product: any) => ({
    ...product,
    id: product._id, // تبدیل _id به id
  }));
};

const ProductsList: React.FC<ProductsListProps> = ({ onDeleteProduct, onEditProduct }) => {
  // استفاده از React Query برای دریافت محصولات
  const { data: products = [], isLoading, error } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Product ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'price', headerName: 'Price', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'stock', headerName: 'Stock', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            className={styles.actionsButton}
            variant="contained"
            color="primary"
            onClick={() => onEditProduct(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onDeleteProduct(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className={styles.tableContainer}>
      <DataGrid
        rows={products}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
};

export default ProductsList;
