"use client";

import React, { useState } from "react";
import { Button, Menu, MenuItem, Box, Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/HelpOutline";
import ShopIcon from "@mui/icons-material/ShoppingBag";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // استفاده از useAuth برای دسترسی به متدهای ورود و خروج
import { useRouter } from "next/navigation"; // برای ریدایرکت
import styles from "./AccountMenu.module.css";

const AccountMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, isAuthenticated } = useAuth(); // دسترسی به وضعیت ورود و متد logout
  const router = useRouter(); // برای ریدایرکت

  // مدیریت باز و بسته شدن منو
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  // متد خروج
  const handleLogout = () => {
    logout(); // حذف توکن و خروج کاربر
    router.push("/auth/phone-verification"); // ریدایرکت به صفحه Phone Verification برای ورود مجدد
  };

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
          <>
            {/* تغییر مسیرهای Log In و Sign Up به صفحه Phone Verification */}
            <Link href="/auth/phone-verification" passHref>
              <MenuItem onClick={handleMouseLeave} className={styles.logInButton}>
                <Image
                  src="/IconLogin.png"
                  alt="Login Icon"
                  width={32}
                  height={32}
                  style={{ marginRight: "0.5px", marginTop: "5px", alignSelf: "center" }}
                />
                Log In
              </MenuItem>
            </Link>
            <Link href="/auth/phone-verification" passHref>
              <MenuItem onClick={handleMouseLeave} className={styles.menuItemHover}>
                <PersonAddIcon sx={{ marginRight: "10px" }} />
                Sign Up
              </MenuItem>
            </Link>
          </>
        ) : (
          <>
            <MenuItem onClick={handleLogout} className={styles.menuItemHover}>
              <AccountCircleIcon sx={{ marginRight: "10px" }} />
              Logout
            </MenuItem>
          </>
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
