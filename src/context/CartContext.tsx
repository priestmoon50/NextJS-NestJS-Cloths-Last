import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string | number; 
  color?: string | number; 
}

interface CartState {
  items: CartItem[];
}

interface CartContextProps {
  cart: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, quantity: number) => void;
}

// Initial State
const initialState: CartState = {
  items: [],
};

// Actions
type Action =
  | { type: 'SET_ITEMS'; payload: CartItem[] } // اضافه کردن اکشنی برای تنظیم کل آیتم‌ها
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } };

const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case 'SET_ITEMS': // تنظیم کل آیتم‌ها
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    default:
      return state;
  }
};

// Context
const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [isMounted, setIsMounted] = useState(false);

  // فقط پس از بارگذاری کلاینت localStorage را بخوانید
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('cart');
      if (localData) {
        dispatch({ type: 'SET_ITEMS', payload: JSON.parse(localData) }); // بازیابی کل آیتم‌ها
      }
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart.items)); // ذخیره‌سازی فقط آیتم‌ها
    }
  }, [cart.items, isMounted]); // فقط زمانی که آیتم‌ها تغییر می‌کنند، ذخیره‌سازی انجام می‌شود

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateItem = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id, quantity } });
  };

  if (!isMounted) {
    return null; // جلوگیری از رندر تا زمان بارگذاری کامل
  }

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
