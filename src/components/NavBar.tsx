"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import AccountMenu from "./AccountMenu"; // ایمپورت کامپوننت جدید

const NavBar: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgba(30, 30, 31, 0.9)",
        padding: "0 20px",
        marginTop: "15px",
        fontFamily: "Roboto, sans-serif",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        zIndex: 1300,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {isMobile && (
          <IconButton edge="start" color="inherit" onClick={toggleDrawer(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: isMobile ? "center" : "flex-start", alignItems: "center" }}>
          <Link href="/" passHref>
            <Box sx={{ cursor: "pointer" }}>
              <Image src="/Logo.png" alt="Logo" width={150} height={60} priority={true} />
            </Box>
          </Link>
        </Box>

        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              fontSize: "16px",
              color: "#fff",
            }}
          >
            <Link href="/products" passHref>
              <Button
                sx={{
                  color: "#fff",
                  "&:hover": {
                    borderBottom: "2px solid #3f51b5",
                    transition: "border-bottom 0.3s ease",
                  },
                }}
              >
                New Arrivals
              </Button>
            </Link>
            <Link href="/products" passHref>
              <Button
                sx={{
                  color: "#fff",
                  "&:hover": {
                    borderBottom: "2px solid #3f51b5",
                    transition: "border-bottom 0.3s ease",
                  },
                }}
              >
                Collections
              </Button>
            </Link>
            <Link href="/products" passHref>
              <Button
                sx={{
                  color: "#fff",
                  "&:hover": {
                    borderBottom: "2px solid #3f51b5",
                    transition: "border-bottom 0.3s ease",
                  },
                }}
              >
                Shop
              </Button>
            </Link>
          </Box>
        )}

        <Box
          sx={{
            flexGrow: isMobile ? 0 : 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <AccountMenu />
          {!isMobile && (
            <Link href="/cart" passHref> {/* لینک به صفحه cart */}
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#3f51b5",
                  color: "#fff",
                  marginLeft: "20px",
                  padding: "10px 20px",
                  fontSize: "16px",
                }}
              >
                View Cart
              </Button>
            </Link>
          )}
        </Box>
      </Toolbar>

      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: { backgroundColor: "#1f1f1f", marginTop: "64px" },
          }}
        >
          <List>
            <ListItem component="a" href="/products">
              <ListItemText primary="New Arrivals" sx={{ color: "#fff" }} />
            </ListItem>
            <ListItem component="a" href="/products">
              <ListItemText primary="Collections" sx={{ color: "#fff" }} />
            </ListItem>
            <ListItem component="a" href="/products">
              <ListItemText primary="Shop" sx={{ color: "#fff" }} />
            </ListItem>
            <ListItem component="a" href="/cart">  {/* اضافه کردن لینک cart به منوی موبایل */}
              <ListItemText primary="View Cart" sx={{ color: "#fff" }} />
            </ListItem>
          </List>
        </Drawer>
      )}
    </AppBar>
  );
};

export default NavBar;
