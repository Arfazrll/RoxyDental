import crypto from 'crypto';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { prisma } from '../config/database';

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service ready');
    } catch (error) {
      console.error('Email service error:', error);
      console.log('Email will be logged to console');
    }
  }

  async generateResetToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt,
      },
    });

    return token;
  }

  async verifyResetToken(email: string, token: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetPasswordToken: token,
      },
    });

    if (!user) {
      return false;
    }

    if (!user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });
      return false;
    }

    return true;
  }

  async clearResetToken(email: string): Promise<void> {
    await prisma.user.updateMany({
      where: { email },
      data: {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }

  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    await prisma.user.updateMany({
      where: {
        resetPasswordExpires: { lt: now },
      },
      data: {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }

  async sendResetEmail(email: string, token: string, fullName: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `POLADC <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Password - POLADC',
      html: this.getResetEmailTemplate(fullName, resetLink),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Reset password email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      console.log(`
========================================
PASSWORD RESET REQUEST
========================================
Recipient: ${email}
Name: ${fullName}
Reset Link: ${resetLink}
Token: ${token}
Expires: 1 hour
========================================
      `);
    }
  }

  private getResetEmailTemplate(fullName: string, resetLink: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #E91E63, #C2185B);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #E91E63;
      margin-top: 0;
    }
    .button {
      display: inline-block;
      padding: 15px 40px;
      background: linear-gradient(135deg, #E91E63, #C2185B);
      color: white !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      background: #f9f9f9;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eee;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .link-box {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      word-break: break-all;
      margin: 20px 0;
      border: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>POLADC</h1>
    </div>
    
    <div class="content">
      <h2>Halo, ${fullName}!</h2>
      
      <p>Kami menerima permintaan untuk mereset password akun Anda di <strong>POLADC</strong>.</p>
      
      <p>Klik tombol di bawah ini untuk mereset password Anda:</p>
      
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password Sekarang</a>
      </div>
      
      <p>Atau copy dan paste link berikut ke browser Anda:</p>
      
      <div class="link-box">
        <a href="${resetLink}" style="color: #E91E63; text-decoration: none;">${resetLink}</a>
      </div>
      
      <div class="warning">
        <p><strong>Perhatian:</strong></p>
        <p>Link ini hanya berlaku selama <strong>1 jam</strong></p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini</p>
        <p>Untuk keamanan, jangan bagikan link ini kepada siapapun</p>
      </div>
      
      <p>Terima kasih,<br>
      <strong>Tim POLADC</strong></p>
    </div>
    
    <div class="footer">
      <p>Email ini dikirim secara otomatis, mohon tidak membalas.</p>
      <p>&copy; ${new Date().getFullYear()} POLADC. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  async sendPasswordChangedEmail(email: string, fullName: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `POLADC <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Berhasil Direset - POLADC',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #4CAF50, #45a049); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; }
    .content { padding: 40px 30px; }
    .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Berhasil Direset</h1>
    </div>
    
    <div class="content">
      <div class="success-icon">&#10004;</div>
      
      <p>Halo <strong>${fullName}</strong>,</p>
      
      <p>Password akun Anda di <strong>POLADC</strong> telah berhasil direset.</p>
      
      <p>Jika Anda tidak melakukan perubahan ini, segera hubungi administrator untuk mengamankan akun Anda.</p>
      
      <p>Terima kasih,<br>
      <strong>Tim POLADC</strong></p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} POLADC. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password changed confirmation sent to ${email}`);
    } catch (error) {
      console.error('Failed to send password changed email:', error);
    }
  }
}

export const emailService = new EmailService();