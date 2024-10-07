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
import { useTranslation } from "react-i18next"; // اضافه کردن i18n برای ترجمه
import styles from "./AccountMenu.module.css";

const AccountMenu: React.FC = () => {
  const { t } = useTranslation();  // استفاده از hook ترجمه
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // مدیریت باز و بسته شدن منو
  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // متد خروج
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
        {t('account')} {/* استفاده از ترجمه برای "Account" */}
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
          <div>
            <Link href="/auth/phone-verification" passHref>
              <MenuItem onClick={handleMouseLeave} className={styles.logInButton}>
                {t('login')} {/* استفاده از ترجمه برای "Log In" */}
              </MenuItem>
            </Link>
            <Link href="/auth/phone-verification" passHref>
              <MenuItem onClick={handleMouseLeave} className={styles.menuItemHover}>
                <PersonAddIcon sx={{ marginRight: "10px" }} />
                {t('signUp')} {/* استفاده از ترجمه برای "Sign Up" */}
              </MenuItem>
            </Link>
          </div>
        ) : (
          <div>
            <MenuItem onClick={handleLogout} className={styles.menuItemHover}>
              <AccountCircleIcon sx={{ marginRight: "10px" }} />
              {t('logout')} {/* استفاده از ترجمه برای "Logout" */}
            </MenuItem>
          </div>
        )}
        <Divider className={styles.divider} />
        <MenuItem onClick={handleMouseLeave} className={styles.menuItemHover}>
          <SettingsIcon sx={{ marginRight: "10px" }} />
          {t('accountSettings')} {/* استفاده از ترجمه برای "Account Settings" */}
        </MenuItem>
        <Divider className={styles.divider} />
        <MenuItem onClick={handleMouseLeave} className={styles.menuItemHover}>
          <SupportIcon sx={{ marginRight: "10px" }} />
          {t('support')} {/* استفاده از ترجمه برای "Support" */}
        </MenuItem>
        <MenuItem onClick={handleMouseLeave} className={styles.menuItemHover}>
          <ShopIcon sx={{ marginRight: "10px" }} />
          {t('shop')} {/* استفاده از ترجمه برای "Shop" */}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AccountMenu;
