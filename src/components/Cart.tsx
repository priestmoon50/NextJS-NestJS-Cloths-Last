import React from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import Link from "next/link";

const Cart: React.FC = () => {
  const { cart, removeItem, updateItem } = useCart();

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Your Shopping Cart
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
            <Link href="/checkout" passHref>
              <Button variant="contained" color="primary">
                Proceed to Checkout
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Cart;