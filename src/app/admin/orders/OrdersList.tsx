// src/admin/orders/OrdersList.tsx
'use client';

import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Order } from '@/data/types';
import styles from './OrdersList.module.css'; // اضافه کردن CSS Module

interface OrdersListProps {
  orders: Order[];
  onUpdateStatus: (id: string, newStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled') => void;
}

const OrdersList: React.FC<OrdersListProps> = ({ orders, onUpdateStatus }) => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 150 },
    { field: 'user', headerName: 'User', width: 150 },
    { field: 'totalPrice', headerName: 'Total Price', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            className={styles.buttonSpacing}
            variant="contained"
            color="primary"
            onClick={() => onUpdateStatus(params.row.id, 'Shipped')}
          >
            Mark as Shipped
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onUpdateStatus(params.row.id, 'Delivered')}
          >
            Mark as Delivered
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <DataGrid
        rows={orders}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
};

export default OrdersList;
