import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(to: string, otp: string, title: string) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your OTP Code</title>
        <style>
          body {
            background-color: #f4f4f7;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 480px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            color: #ffffff;
            text-align: center;
            padding: 25px 10px;
          }
          .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 600;
          }
          .content {
            padding: 25px 30px;
            color: #333333;
            text-align: center;
          }
          .otp-box {
            display: inline-block;
            background: #f9fafb;
            border: 2px dashed #4f46e5;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 28px;
            font-weight: bold;
            color: #111827;
            letter-spacing: 4px;
            margin: 20px 0;
          }
          .footer {
            background: #f9fafb;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            <p>Use the following OTP code to verify your account:</p>
            <div class="otp-box">${otp}</div>
            <p>This code will expire soon. Please do not share it with anyone.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.mailerService.sendMail({
      to,
      subject: 'Your OTP Code',
      html,
    });
  }
}
