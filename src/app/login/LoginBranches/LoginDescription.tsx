import React from 'react';
import styles from './LoginDescription.module.css'; // فایل CSS جداگانه برای استایل‌ها

const LoginDescription: React.FC = () => {
  return (
    <div className={styles.descriptionContainer}>
      {/* لینک کردن ModaPersia.com به صفحه اصلی */}
      <h1 className={styles.title}>
        <a href="/">ModaPersia.com</a>
      </h1>
      {/* متن با انیمیشن تایپ */}
      <p className={styles.typingText}>
        With your clothes Define your personality
      </p>
    </div>
  );
};

export default LoginDescription;
