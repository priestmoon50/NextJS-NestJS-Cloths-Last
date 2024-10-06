// app/auth/phone-verification/PhoneVerification.tsx
import { useState } from 'react';
import axios from 'axios';
import styles from './PhoneVerification.module.css';

export default function PhoneVerification() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10,12}$/;  // شماره تلفن معتبر (بسته به کشور)
    return phoneRegex.test(phone);
  };

  const sendPhone = async () => {
    if (!validatePhone(phone)) {
      setError('Invalid phone number');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/auth/verify-phone', { phone });
      setIsCodeSent(true);
      setError('');  // پاک کردن خطا در صورت موفقیت
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/confirm-code', { phone, code });
      if (res.data.success) {
        localStorage.setItem('token', res.data.accessToken);  // ذخیره JWT در localStorage
        setIsCodeConfirmed(true);
        setError('');  // پاک کردن خطا در صورت موفقیت
      } else {
        setError(res.data.message);  // اگر کد تایید نشد، پیام خطا نمایش داده شود
      }
    } catch (err) {
      setError('Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.header}>Phone Verification</h1>
        {error && <div className={styles.errorMessage}>{error}</div>} {/* نمایش خطا */}
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
