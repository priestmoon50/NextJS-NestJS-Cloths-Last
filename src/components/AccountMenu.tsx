"use client";

import React, { useState, useCallback } from "react";
import { Button, Menu, MenuItem, Box, Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/HelpOutline";
import ShopIcon from "@mui/icons-material/ShoppingBag";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./AccountMenu.module.css";

const AccountMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // مدیریت باز و بسته شدن منو با استفاده از useCallback
  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // متد خروج با استفاده از useCallback
  const handleLogout = useCallback(() => {
    logout();
    router.push("/auth/phone-verification");
  }, [logout, router]);

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ display: "inline-block" }}
    >
      <Button
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl) ? "true" : "false"}
        aria-controls="account-menu"
        sx={{
          color: "#000000",
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          fontSize: "16px",
        }}
      >
        <AccountCircleIcon sx={{ marginRight: "5px" }} />
        Account
        <ArrowDropDownIcon />
      </Button>

      <Menu
  id="account-menu"
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMouseLeave}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "center",
  }}
  transformOrigin={{
    vertical: "top",
    horizontal: "center",
  }}
  MenuListProps={{
    "aria-labelledby": "account-button",
  }}
  PaperProps={{
    className: styles.menuPaper,
  }}
>
  {!isAuthenticated ? (
    <div> {/* به جای <>...</> از <div>...</div> استفاده کنید */}
      <Link href="/auth/phone-verification" passHref>
        <MenuItem onClick={handleMouseLeave} className={styles.logInButton}>
          Log In
        </MenuItem>
      </Link>
      <Link href="/auth/phone-verification" passHref>
        <MenuItem onClick={handleMouseLeave} className={styles.menuItemHover}>
          <PersonAddIcon sx={{ marginRight: "10px" }} />
          Sign Up
        </MenuItem>
      </Link>
    </div>
  ) : (
    <div> {/* اینجا هم به جای Fragment از <div> استفاده کنید */}
      <MenuItem onClick={handleLogout} className={styles.menuItemHover}>
        <AccountCircleIcon sx={{ marginRight: "10px" }} />
        Logout
      </MenuItem>
    </div>
  )}
  <Divider className={styles.divider} />
  <MenuItem onClick={handleMouseLeave} className={styles.menuItemHover}>
    <SettingsIcon sx={{ marginRight: "10px" }} />
    Account Settings
  </MenuItem>
  <Divider className={styles.divider} />
  <MenuItem onClick={handleMouseLeave} className={styles.menuItemHover}>
    <SupportIcon sx={{ marginRight: "10px" }} />
    Support
  </MenuItem>
  <MenuItem onClick={handleMouseLeave} className={styles.menuItemHover}>
    <ShopIcon sx={{ marginRight: "10px" }} />
    Shop
  </MenuItem>
</Menu>


    </Box>
  );
};

export default AccountMenu;
