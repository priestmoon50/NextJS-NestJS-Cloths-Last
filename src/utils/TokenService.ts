class TokenService {
  private tokenKey = 'token';  // کلید ذخیره توکن در localStorage

  // بررسی وجود window و استفاده از localStorage فقط در مرورگر
  private isBrowser = typeof window !== 'undefined';

  // ذخیره توکن در localStorage
  setToken(token: string): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.tokenKey, token);
        console.log('Token successfully stored in localStorage');
      } catch (error) {
        console.error('Error saving token in localStorage:', error);
      }
    }
  }

  // دریافت توکن از localStorage
  getToken(): string | null {
    if (this.isBrowser) {
      try {
        return localStorage.getItem(this.tokenKey);
      } catch (error) {
        console.error('Error retrieving token from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  // حذف توکن از localStorage (برای خروج)
  removeToken(): void {
    if (this.isBrowser) {
      try {
        localStorage.removeItem(this.tokenKey);
        console.log('Token removed from localStorage');
      } catch (error) {
        console.error('Error removing token from localStorage:', error);
      }
    }
  }

  // بررسی اعتبار توکن (بررسی زمان انقضا و اعتبار JWT)
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = this.getTokenPayload();
    if (!payload) {
      return false;
    }

    const currentTime = Date.now() / 1000;  // زمان فعلی به ثانیه
    return payload.exp > currentTime;  // بررسی انقضا توکن
  }

  // متد برای دریافت payload توکن
  getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    return this.parseJwt(token);
  }

  // متد کمکی برای دیکد کردن JWT و استخراج payload
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Invalid token format:', error);
      return null;
    }
  }
}

export default new TokenService();  // صادر کردن یک نمونه از کلاس
