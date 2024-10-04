'use client';

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CheckoutPage: React.FC = () => {
  const { cart, removeItem, updateItem } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // فرض کنیم که اطلاعات کاربر از پروفایل یا localStorage دریافت شود
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData && userData.name) {
      setName(userData.name || "");
      setAddress(userData.address || "");
      setPhone(userData.phone || "");
    } else {
      setIsGuest(true);
      setOpenModal(true);
    }
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: "USER_ID_HERE", // باید ID کاربر وارد شده را قرار دهید
        items: cart.items,
        totalPrice: cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        name,
        address,
        phone,
        status: 'Pending',
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        router.push('/confirmation');
      } else {
        console.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Sign In Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To complete your purchase, please sign in.
          </DialogContentText>
          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              If you have an account, please <Link href="/login" style={{ color: "blue", fontWeight: "bold" }}>log in</Link>.
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              If you don't have an account, please <Link href="/register" style={{ color: "blue", fontWeight: "bold" }}>register</Link>.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Box sx={{ marginBottom: "20px" }}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginBottom: "10px" }}
        />
        <TextField
          fullWidth
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ marginBottom: "10px" }}
        />
        <TextField
          fullWidth
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ marginBottom: "20px" }}
        />
      </Box>

      <Typography variant="h5" gutterBottom>
        Order Summary
      </Typography>
      {cart.items.length === 0 ? (
        <Typography variant="h6">Your cart is currently empty.</Typography>
      ) : (
        <>
          <List>
            {cart.items.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemText
                  primary={`${item.name} - $${item.price} x ${item.quantity}`}
                  secondary={`Size: ${item.size || "N/A"}, Color: ${
                    item.color || "N/A"
                  }`}
                />

                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    sx={{ marginRight: "10px" }}
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
                    sx={{ marginRight: "10px" }}
                  >
                    -
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>

          <Box sx={{ marginTop: "20px", textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrder}
              sx={{ padding: "10px 20px" }}
            >
              Place Order
            </Button>
            <Link href="/cart" passHref>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ marginLeft: "10px", padding: "10px 20px" }}
              >
                Back to Cart
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CheckoutPage;
