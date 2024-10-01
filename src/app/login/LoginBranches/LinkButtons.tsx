import React from 'react';
import Link from 'next/link';
import { Button, Box } from '@mui/material';
import { LinkButtonsProps } from '@/data/types';
import styles from '../Login.module.css';  // ایمپورت CSS ماژول

const LinkButtons: React.FC<LinkButtonsProps> = ({ forgotPasswordLink, registerLink }) => {
  return (
    <>
      <Box className={styles.signupBox}>
        <span>Don't have an account?</span>
        <Link href={registerLink} passHref>
          <Button variant="text" className={styles.signup}> {/* استفاده از کلاس جدید */}
            Signup Now
          </Button>
        </Link>
      </Box>
    </>
  );
};

export default LinkButtons;
