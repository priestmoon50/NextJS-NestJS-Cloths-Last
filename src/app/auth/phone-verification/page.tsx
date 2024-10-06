"use client";  // برای اطمینان از اینکه این کامپوننت در سمت کلاینت اجرا می‌شود

import PhoneVerification from './PhoneVerification';

export default function Page() {
  return (
    <div style={{ marginTop: '100px' }}>  {/* اضافه کردن فاصله 100 پیکسل از بالا */}
      <h1>Phone Verification</h1>
      <PhoneVerification />
    </div>
  );
}
