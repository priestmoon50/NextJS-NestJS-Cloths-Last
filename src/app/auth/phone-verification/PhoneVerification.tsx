import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PhoneVerification.module.css';

export default function PhoneVerification() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60); // تایمر برای ارسال مجدد کد
  const [resendEnabled, setResendEnabled] = useState(false); // امکان ارسال مجدد

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10,12}$/;  // شماره تلفن معتبر (بسته به کشور)
    return phoneRegex.test(phone);
  };

  // ارسال کد به شماره کاربر
  const sendPhone = async () => {
    if (!validatePhone(phone)) {
      setError('Invalid phone number');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/auth/verify-phone', { phone });
      setIsCodeSent(true);
      setError('');
      setResendEnabled(false); // غیرفعال کردن دکمه ارسال مجدد
      setTimer(60); // شروع تایمر 60 ثانیه‌ای
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // تایید کد ارسال شده
  const verifyCode = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/confirm-code', { phone, code });
      if (res.data.success) {
        localStorage.setItem('token', res.data.accessToken);
        setIsCodeConfirmed(true);
        setError('');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  // مدیریت تایمر برای ارسال مجدد کد
  useEffect(() => {
    if (isCodeSent && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
    if (timer === 0) {
      setResendEnabled(true);
    }
  }, [isCodeSent, timer]);

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
            {resendEnabled ? (
              <button onClick={sendPhone} className={styles.resendButton}>
                Resend Code
              </button>
            ) : (
              <div className={styles.timer}>Resend available in {timer}s</div>
            )}
          </div>
        )}
        {isCodeConfirmed && <div className={styles.successMessage}>Code confirmed! You are logged in.</div>}
      </div>
    </div>
  );
}
