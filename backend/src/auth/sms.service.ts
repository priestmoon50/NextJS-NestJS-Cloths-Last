import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly senderNumber: string;
  private readonly signature: string;

  constructor() {
    // دریافت اطلاعات از env
    this.senderNumber = process.env.PARSGREEN_SENDER_NUMBER;
    this.signature = process.env.PARSGREEN_SIGNATURE;

    if (!this.signature || !this.senderNumber) {
      this.logger.error('Pargreen API configuration is missing.');
      throw new InternalServerErrorException('Pargreen API configuration is missing.');
    }
  }

  async sendVerificationCode(phone: string, code: string): Promise<void> {
    try {
      const message = `Your verification code is ${code}`;
      
      // ارسال درخواست به API پارس گرین با استفاده از HttpGet
      const response = await axios.get(`http://sms.parsgreen.ir/UrlService/sendSMS.ashx`, {
        params: {
          from: this.senderNumber,
          to: phone,
          text: message,
          signature: this.signature,
        },
      });

      if (response.status === 200) {
        this.logger.log(`Verification code sent to ${phone}`);
      } else {
        this.logger.error(`Failed to send SMS to ${phone}: ${response.data}`);
        throw new InternalServerErrorException('Failed to send verification code. Please try again.');
      }
    } catch (error) {
      this.logger.error(`Error sending SMS to ${phone}: ${error.message}`);
      throw new InternalServerErrorException('Failed to send verification code. Please try again.');
    }
  }
}
 