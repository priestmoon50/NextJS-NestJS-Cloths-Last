import axios from 'axios';

const API_KEY = process.env.PARS_GREEN_API_KEY; // دسترسی به API key از طریق process.env
const SMS_API_URL = 'https://api.parsgreen.ir/v1/'; // آدرس API سرویس پیامک

export const sendSms = async (phone: string, message: string) => {
  try {
    const response = await axios.post(`${SMS_API_URL}/send`, {
      api_key: API_KEY, // استفاده از کلید API که از .env.local میاد
      phone_number: phone, // شماره تلفن مقصد
      message: message, // متن پیامک
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
};
