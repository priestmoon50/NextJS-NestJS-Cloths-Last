import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  private client: twilio.Twilio;
  private readonly logger = new Logger(SmsService.name);

  constructor() {
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    // بررسی اینکه مقادیر مورد نیاز به درستی تنظیم شده باشند
    if (!accountSid || !authToken || !fromPhone) {
      throw new InternalServerErrorException('Twilio configuration is missing.');
    }

    this.client = twilio(accountSid, authToken);
  }

  async sendVerificationCode(phone: string, code: string): Promise<void> {
    try {
      // ارسال پیامک با کد تایید
      await this.client.messages.create({
        body: `Your verification code is ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      this.logger.log(`Verification code sent to ${phone}`);
    } catch (error) {
      this.logger.error(`Error sending SMS to ${phone}: ${error.message}`);
      throw new InternalServerErrorException('Failed to send verification code. Please try again.');
    }
  }
}
