// src/admin/orders/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import OrdersList, { OrdersListProps } from './OrdersList';
import { Order } from '@/data/types';

const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch('/api/orders'); // فرض می‌کنیم API داریم
  return response.json();
};

const OrdersPage: React.FC = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],  // تغییر به استفاده از شیء
    queryFn: fetchOrders,
  });

  const [orderList, setOrderList] = useState<Order[]>([]);

  useEffect(() => {
    console.log("Orders data:", orders);  
    if (orders) {
      setOrderList(orders);
    }
  }, [orders]);

  const handleUpdateStatus = (id: string, newStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled') => {
    const updatedOrders = orderList.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrderList(updatedOrders);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;
  
  return (
    <Container sx={{ marginTop: '100px' }}>
      <Typography color='white' variant="h4" gutterBottom>
        Orders Management
      </Typography>
      <OrdersList orders={orderList} onUpdateStatus={handleUpdateStatus as OrdersListProps['onUpdateStatus']} />
    </Container>
  );
};

export default OrdersPage;