import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PhoneVerification.module.css';

const baseURL = 'http://localhost:3001';

export default function PhoneVerification() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  const sendPhone = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/auth/verify-phone`, { phone });
      setIsCodeSent(true);
      setError('');
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/auth/confirm-code`, { phone, code });
      if (response.data.accessToken) {
        // ذخیره توکن در localStorage
        localStorage.setItem('token', response.data.accessToken);
        setIsCodeConfirmed(true);
        setToken(response.data.accessToken); // ذخیره توکن در state
        setError('');
      } else {
        setError('Invalid code or failed to login');
      }
    } catch (err) {
      setError('Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCodeConfirmed) {
      // هدایت کاربر به صفحه‌ی مورد نظر بعد از تایید کد و دریافت توکن
      window.location.href = '/'; // به مسیر دلخواه هدایت کنید
    }
  }, [isCodeConfirmed]);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.header}>Phone Verification</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {!isCodeSent ? (
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} 
              className={styles.input}
            />
            <button onClick={sendPhone} className={styles.button} disabled={loading}>
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        ) : (
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)} 
              className={styles.input}
            />
            <button onClick={verifyCode} className={styles.button} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
        )}
        {isCodeConfirmed && <div className={styles.successMessage}>Code confirmed! You are logged in.</div>}
      </div>
    </div>
  );
}
