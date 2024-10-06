// src/components/SignInModal.tsx
"use client";

import React from "react";
import { Box, Typography, Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Link from "next/link";

interface SignInModalProps {
  open: boolean;
}

const SignInModal: React.FC<SignInModalProps> = ({ open }) => {
  return (
    <Dialog open={open} onClose={() => {}} disableEscapeKeyDown={true}>
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
  );
};

export default SignInModal;
