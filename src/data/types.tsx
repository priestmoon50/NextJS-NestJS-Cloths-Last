// src/data/types.ts


// تایپ‌های مربوط به محصولات
export interface Product {
  _id: any;
  id: string | number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category?: string;
  sizes?: string | number | (string | number)[]; // انعطاف‌پذیری در نوع سایزها
  colors?: string | number | (string | number)[]; // انعطاف‌پذیری در نوع رنگ‌ها
  description?: string;
  rating?: number;
  stock?: number;
  reviews?: string[];
  discount?: number;
  imageUrl?: string
  quantity?: number;
  
}

// تایپ‌های مربوط به آیتم‌های سبد خرید
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}


// تایپ‌های مربوط به فرم‌ها و سایر بخش‌ها به همان شکل قبلی باقی می‌مانند.

// تایپ‌های مربوط به کاربران
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Admin'; // تعیین نقش کاربران
}
// تایپ‌های مربوط به سفارشات
export interface Order {
  [x: string]: string | number | Date;
  id: string;
  user: string;
  totalPrice: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'; // محدود کردن مقادیر وضعیت
}

export interface ProductRatingProps {
  rating: number;
  reviewsCount: number;
}

export interface ProductPriceProps {
  price: number;
  discount?: number;
}

export interface ProductImagesProps {
  images: string[];
}

// تایپ‌های مربوط به فرم‌ها
export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// تایپ‌های مورد نیاز برای کامپوننت‌های مشترک

export interface PasswordFieldProps {
  label: string;
  error: boolean;
  helperText?: string;  // string | undefined
  register: any;
  
}

export interface SubmitButtonProps {
  isSubmitting: boolean;
  label: string;
}

export interface LinkButtonsProps {
  forgotPasswordLink: string;
  registerLink: string;
}

export interface ForgotPasswordFormInputs {
  email: string;
}