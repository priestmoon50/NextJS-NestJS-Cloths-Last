// components/Footer.tsx
'use client';

import React from 'react';
import { Box, Container, Grid, Typography, Link, TextField, Button } from '@mui/material';
import { FaFacebook, FaInstagram, FaTwitter, FaPaypal, FaCcVisa, FaCcMastercard } from 'react-icons/fa'; // Added PayPal and Credit Card icons

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#333', color: '#fff', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>About Us</Typography>
            <Typography variant="body2">
              High-quality women’s fashion with the latest trends. Discover the exclusive collection now!
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Quick Links</Typography>
            <Typography variant="body2">
              <Link href="/about" color="inherit">About Us</Link><br />
              <Link href="/contact" color="inherit">Contact</Link><br />
              <Link href="/privacy" color="inherit">Privacy Policy</Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Stay Connected</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="https://facebook.com" color="inherit"><FaFacebook /></Link>
              <Link href="https://instagram.com" color="inherit"><FaInstagram /></Link>
              <Link href="https://twitter.com" color="inherit"><FaTwitter /></Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>Newsletter</Typography>
            <Typography variant="body2" gutterBottom>
              Subscribe to get the latest fashion trends delivered to your inbox.
            </Typography>
            <Box component="form">
              <TextField
                label="Enter your email"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ bgcolor: '#fff', borderRadius: '4px', mb: 1 }}
              />
              <Button variant="contained" color="primary" fullWidth>
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Typography variant="body2">
            Payment Methods
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
            <FaPaypal color="#003087" size={32} /> {/* PayPal icon */}
            <FaCcVisa color="#1a1f71" size={32} /> {/* Visa icon */}
            <FaCcMastercard color="#FF5F00" size={32} /> {/* Mastercard icon */}
          </Box>
        </Box>

        <Box mt={4} textAlign="center">
          <Typography variant="body2">
            © 2024 My Clothing Shop | All Rights Reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
