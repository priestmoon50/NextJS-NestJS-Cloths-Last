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
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d+$/, "Phone number must be numeric"),
});

const CheckoutPage: React.FC = () => {
  const { cart, removeItem, updateItem } = useCart();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [isGuest, setIsGuest] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData || !userData.name) {
      setIsGuest(true);
      setOpenModal(true);
    }
  }, []);

  const handlePlaceOrder = async (data: any) => {
    try {
      const orderData = {
        userId: "USER_ID_HERE", // Replace with actual user ID
        items: cart.items,
        totalPrice: cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        name: data.name,
        address: data.address,
        phone: data.phone,
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

      <form onSubmit={handleSubmit(handlePlaceOrder)}>
        <Box sx={{ marginBottom: "20px" }}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Name"
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
                sx={{ marginBottom: "10px" }}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Address"
                error={!!errors.address}
                helperText={errors.address ? errors.address.message : ""}
                sx={{ marginBottom: "10px" }}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Phone"
                error={!!errors.phone}
                helperText={errors.phone ? errors.phone.message : ""}
                sx={{ marginBottom: "20px" }}
              />
            )}
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
                    secondary={`Size: ${item.size || "N/A"}, Color: ${item.color || "N/A"}`}
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
                type="submit"
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
      </form>
    </Box>
  );
};

export default CheckoutPage;
