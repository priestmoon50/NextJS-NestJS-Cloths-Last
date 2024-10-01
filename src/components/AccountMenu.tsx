"use client";

import React, { useState } from "react";
import { Button, Menu, MenuItem, Box, Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/HelpOutline";
import ShopIcon from "@mui/icons-material/ShoppingBag";
import PersonAddIcon from "@mui/icons-material/PersonAdd"; // آیکون Sign Up
import Image from "next/image"; // برای استفاده از تصویر
import Link from "next/link"; // اضافه کردن لینک‌های Next.js
import styles from "./AccountMenu.module.css"; // ایمپورت فایل CSS

const AccountMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // مدیریت باز شدن منو
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // مدیریت بسته شدن منو
  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave} // بسته شدن منو وقتی که ماوس از روی باکس کلی خارج شد
      sx={{ display: "inline-block" }} // اضافه کردن استایل نمایش به عنوان inline-block برای کنترل دقیق‌تر
    >
      <Button
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl) ? "true" : "false"}
        aria-controls="account-menu"
        sx={{
          color: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "10px 20px", // بزرگ‌تر کردن کل دکمه
          fontSize: "16px", // بزرگ‌تر کردن متن
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
        onClose={handleMouseLeave} // بستن منو وقتی که ماوس از روی منو رفت
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center", // قرار گرفتن منو زیر "Account" در مرکز
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center", // قرار گرفتن منو زیر "Account"
        }}
        MenuListProps={{
          "aria-labelledby": "account-button",
        }}
        PaperProps={{
          className: styles.menuPaper, // استفاده از استایل‌های CSS Modules
        }}
      >
        {/* دکمه Log In */}
        <Link href="/login" passHref> {/* لینک برای صفحه لاگین */}
          <MenuItem onClick={handleMouseLeave} className={styles.logInButton}>
            <Image
              src="/IconLogin.png" // مسیر به تصویر در public
              alt="Login Icon"
              width={32} // اندازه بزرگ‌تر آیکون
              height={32}
              style={{ marginRight: "0.5px", marginTop: "5px", alignSelf: "center" }} // فاصله بیشتر از متن و وسط‌چین کردن
            />
            Log In
          </MenuItem>
        </Link>

        {/* Divider برای جدا کردن بخش‌ها */}
        <Divider className={styles.divider} />

        {/* گزینه‌های Account Settings و Sign Up */}
        <MenuItem onClick={handleMouseLeave} className={styles.menuItemHover}>
          <SettingsIcon sx={{ marginRight: "10px" }} />
          Account Settings
        </MenuItem>

        <Link href="/register" passHref> {/* لینک برای صفحه ثبت‌نام */}
          <MenuItem onClick={handleMouseLeave} className={styles.menuItemHover}>
            <PersonAddIcon sx={{ marginRight: "10px" }} />
            Sign Up
          </MenuItem>
        </Link>

        {/* Divider دیگر */}
        <Divider className={styles.divider} />

        {/* گزینه‌های دیگر */}
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
