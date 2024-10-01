'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import styles from './cart.module.css';  // وارد کردن استایل‌های CSS Module

// تابعی که سبد خرید را از API دریافت می‌کند
const fetchCart = async (userId: string) => {
  const response = await fetch(`http://localhost:3001/cart/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch cart data');
  }
  return response.json();
};

// تابع برای حذف محصول از سبد خرید
const deleteCartItem = async (cartId: string) => {
  const response = await fetch(`http://localhost:3001/cart/${cartId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete cart item');
  }
  return response.json();
};

export default function CartPage() {
  const queryClient = useQueryClient();
  const [userId] = useState<string>('12345');

  // کوئری برای دریافت داده‌های سبد خرید
  const { data, error, isLoading } = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => fetchCart(userId),
    enabled: !!userId,  // فقط زمانی که userId معتبر باشد کوئری اجرا می‌شود
  });

  // Mutation برای حذف محصول از سبد خرید
  const deleteMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });  // اصلاح شده
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Shopping Cart</h1>
      <ul>
        {data?.map((item: any) => (
          <li key={item.productId} className={styles.cartItem}>
            <p>Product ID: {item.productId}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Total Price: {item.totalPrice}</p>
            <button
              onClick={() => deleteMutation.mutate(item.cartId)}
              className={styles.deleteButton}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {deleteMutation.isPending && <p>Deleting item...</p>}  {/* استفاده از isPending */}
      {deleteMutation.isError && <p>Error: {deleteMutation.error?.message}</p>}
    </div>
  );
}
