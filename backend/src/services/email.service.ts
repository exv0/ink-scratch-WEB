// backend/src/services/email.service.ts - UPDATED WITH DEV MODE

import * as nodemailer from 'nodemailer';
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';

    // Only create transporter if email credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        this.transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        console.log('✅ Email service initialized with SMTP');
      } catch (error) {
        console.error('⚠️ Failed to initialize email service:', error);
        this.transporter = null;
      }
    } else {
      console.log('⚠️ Email credentials not found - using console logging mode');
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;

    // Development mode or no email configured - log to console
    if (!this.transporter || this.isDevelopment) {
      console.log('\n' + '='.repeat(80));
      console.log('📧 PASSWORD RESET EMAIL (Development Mode)');
      console.log('='.repeat(80));
      console.log('To:', to);
      console.log('Reset URL:', resetUrl);
      console.log('Reset Token:', resetToken);
      console.log('='.repeat(80) + '\n');
      return;
    }

    // Production mode - send real email
    const mailOptions = {
      from: `"InkScratch" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Password Reset Request - InkScratch',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              border-radius: 10px;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 20px;
              color: white;
              text-align: center;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h2 style="color: #667eea;">Password Reset Request</h2>
              <p>Hello,</p>
              <p>You requested to reset your password for your InkScratch account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Best regards,<br>The InkScratch Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} InkScratch. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        You requested to reset your password for your InkScratch account.
        
        Click this link to reset your password: ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        The InkScratch Team
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent to:', to);
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send password reset confirmation email
   */
  async sendPasswordResetConfirmation(to: string): Promise<void> {
    // Development mode or no email configured - log to console
    if (!this.transporter || this.isDevelopment) {
      console.log('\n' + '='.repeat(80));
      console.log('📧 PASSWORD RESET CONFIRMATION (Development Mode)');
      console.log('='.repeat(80));
      console.log('To:', to);
      console.log('Message: Password reset successful');
      console.log('='.repeat(80) + '\n');
      return;
    }

    // Production mode - send real email
    const mailOptions = {
      from: `"InkScratch" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Password Reset Successful - InkScratch',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 30px;
              border-radius: 10px;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
            }
            .footer {
              margin-top: 20px;
              color: white;
              text-align: center;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h2 style="color: #10b981;">Password Reset Successful ✓</h2>
              <p>Hello,</p>
              <p>Your password has been successfully reset.</p>
              <p>You can now log in with your new password.</p>
              <p>If you didn't make this change, please contact our support team immediately.</p>
              <p>Best regards,<br>The InkScratch Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} InkScratch. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset confirmation sent to:', to);
    } catch (error) {
      console.error('❌ Error sending confirmation email:', error);
      // Don't throw here - password was already reset successfully
    }
  }
}