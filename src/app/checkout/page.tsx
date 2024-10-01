'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query'; // React Query برای مدیریت درخواست‌ها
import styles from './checkout.module.css';  // CSS Module برای استایل‌دهی

interface CheckoutFormData {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
}

interface OrderData {
  userId: string;
  shippingAddress: string;
  paymentMethod: string;
  products: { productId: string; quantity: number }[];
  totalPrice: number;
}

export default function Checkout() {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();

  // Mutation برای ارسال اطلاعات به بک‌اند
  const mutation = useMutation({
    mutationFn: async (newOrder: OrderData) => {
      const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      return response.json();
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    const orderData: OrderData = {
      userId: '12345',  // فرضی، می‌توانید به صورت پویا دریافت کنید
      shippingAddress: `${data.address}, ${data.city}, ${data.postalCode}`,
      paymentMethod: data.paymentMethod,
      products: [{ productId: '1', quantity: 2 }],  // به‌صورت فرضی
      totalPrice: 200,  // به‌صورت فرضی
    };
    mutation.mutate(orderData);  // ارسال اطلاعات سفارش به بک‌اند
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label>Name:</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className={styles.formInput}
          />
          {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Address:</label>
          <input
            {...register('address', { required: 'Address is required' })}
            className={styles.formInput}
          />
          {errors.address && <span className={styles.errorText}>{errors.address.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>City:</label>
          <input
            {...register('city', { required: 'City is required' })}
            className={styles.formInput}
          />
          {errors.city && <span className={styles.errorText}>{errors.city.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Postal Code:</label>
          <input
            {...register('postalCode', { required: 'Postal code is required' })}
            className={styles.formInput}
          />
          {errors.postalCode && <span className={styles.errorText}>{errors.postalCode.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Payment Method:</label>
          <select
            {...register('paymentMethod', { required: 'Please select a payment method' })}
            className={styles.formInput}
          >
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
          {errors.paymentMethod && <span className={styles.errorText}>{errors.paymentMethod.message}</span>}
        </div>

        <button type="submit" className={styles.formButton}>Complete Purchase</button>
      </form>

      {/* پیام موفقیت یا خطا */}
      {mutation.isPending && <p>Loading...</p>}  
      {mutation.isError && <p>Error: {mutation.error?.message}</p>}
      {mutation.isSuccess && <p>Order created successfully!</p>}
    </div>
  );
}
