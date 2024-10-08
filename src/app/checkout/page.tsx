'use client';

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/context/AuthContext";
import TokenService from "@/utils/TokenService"; 
import SignInModal from "@/components/SignInModal"; 

const validationSchema = yup.object().shape({
  address: yup.string().required("Address is required"),
});

const CheckoutPage: React.FC = () => {
  const { cart, removeItem, updateItem } = useCart();
  const router = useRouter();
  const { isAuthenticated } = useAuth(); 
  const [userData, setUserData] = useState({ name: "", phone: "", userId: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // گرفتن اطلاعات کاربر اگر وارد شده باشد
  useEffect(() => {
    const token = TokenService.getToken();
    console.log("Token from localStorage:", token);
    if (token) {
      setIsLoading(true);
      fetch("/api/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user data");
          return res.json();
        })
        .then((data) => {
          console.log("User data from API:", data);
          setUserData({ name: data.name, phone: data.phone, userId: data.id });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setHasError(true);
          setIsLoading(false);
        });
    } else {
      setOpenModal(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setOpenModal(false);
    }
  }, [isAuthenticated]);

  const handlePlaceOrder = async (data: any) => {
    try {
      const orderData = {
        userId: userData.userId,
        items: cart.items,
        totalPrice: cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        name: userData.name,
        address: data.address,
        phone: userData.phone,
        status: 'Pending',
      };

      console.log("Order data being sent to API:", orderData);

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

      {/* مودال ورود */}
      <SignInModal open={openModal} />

      <form onSubmit={handleSubmit(handlePlaceOrder)}>
        <Box sx={{ marginBottom: "20px" }}>
          <TextField
            fullWidth
            label="Name"
            value={userData.name || ""}
            InputProps={{
              readOnly: isAuthenticated,
            }}
            sx={{ marginBottom: "10px" }}
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
          <TextField
            fullWidth
            label="Phone"
            value={userData.phone || ""}
            InputProps={{
              readOnly: isAuthenticated,
            }}
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
