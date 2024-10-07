'use client';

import React from "react";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useTranslation } from "react-i18next";  // اضافه کردن i18n برای ترجمه
import styles from "./Cart.module.css";
import { CartItem } from "@/data/types"; // استفاده از تایپ CartItem

const Cart: React.FC = () => {
  const { cart, removeItem, updateItem } = useCart();
  const { t } = useTranslation();  // استفاده از hook ترجمه

  return (
    <Box className={styles.cartContainer}>
      <Typography variant="h4" gutterBottom className={styles.cartTitle}>
        {t('shoppingCart')} {/* ترجمه برای عنوان "Your Shopping Cart" */}
      </Typography>
      {cart.items.length === 0 ? (
        <Typography variant="h6" className={styles.emptyCartMessage}>
          {t('emptyCart')} {/* ترجمه برای پیام "Your cart is currently empty" */}
        </Typography>
      ) : (
        <>
          <List className={styles.cartList}>
            {cart.items.map((item: CartItem) => ( // استفاده از تایپ CartItem برای آیتم‌های سبد خرید
              <ListItem key={item.id} className={styles.cartListItem}>
                <ListItemText
                  primary={
                    <Typography variant="h6" className={styles.itemName}>
                      {item.name}
                    </Typography>
                  }
                />
                <Box className={styles.itemDetailsList}>
                  <Typography className={styles.productDetail}>
                    <span className={styles.productDetailLabel}>{t('price')}:</span>
                    <span className={styles.productDetailValue}>${item.price}</span>
                  </Typography>
                  <Typography className={styles.productDetail}>
                    <span className={styles.productDetailLabel}>{t('quantity')}:</span>
                    <span className={styles.productDetailValue}>{item.quantity}</span>
                  </Typography>
                  <Typography className={styles.productDetail}>
                    <span className={styles.productDetailLabel}>{t('size')}:</span>
                    <span className={styles.productDetailValue}>{item.size || "N/A"}</span>
                  </Typography>
                  <Typography className={styles.productDetail}>
                    <span className={styles.productDetailLabel}>{t('color')}:</span>
                    <span className={styles.productDetailValue}>{item.color || "N/A"}</span>
                  </Typography>
                </Box>
                <Box className={styles.buttonContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    className={styles.quantityButton}
                  >
                    +
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      updateItem(
                        item.id,
                        item.quantity > 1 ? item.quantity - 1 : 1
                      )
                    }
                    className={styles.quantityButton}
                  >
                    -
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeItem(item.id)}
                    className={styles.removeButton}
                  >
                    {t('remove')} {/* ترجمه برای دکمه "Remove" */}
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>

          <Box className={styles.checkoutContainer}>
            <Link href="/checkout" passHref>
              <Button variant="contained" color="primary" className={styles.checkoutButton}>
                {t('proceedToCheckout')} {/* ترجمه برای دکمه "Proceed to Checkout" */}
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;
