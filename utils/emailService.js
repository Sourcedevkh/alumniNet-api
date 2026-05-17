const dbConfig = require('../config/db');
const transporter = require('../config/mailler');

// send verification link mail
const sendVerificationEmail = async (to, token) => {
  const verificationLink = `${dbConfig.appUrl}/api/admin/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `AlumniNet <noreply@alumninet.com>`,
    to,
    subject: 'Confirm your email address',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 10px;
        }
        .header { text-align: center; padding-bottom: 20px; }
        .button-container { text-align: center; margin: 30px 0; }
        .button {
          background-color: #4F46E5;
          color: white !important;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          display: inline-block;
        }
        .footer { font-size: 12px; color: #888; text-align: center; margin-top: 30px; }
        .link-alt { word-break: break-all; font-size: 11px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to AlumniNet!</h2>
        </div>
        <p>Hi there,</p>
        <p>Thanks for signing up! Please confirm your email address to activate your account and get started.</p>
        
        <div class="button-container">
          <a href="${verificationLink}" class="button">Verify Email Address</a>
        </div>
        
        <p>This link will <strong>expire in 15 minutes</strong>. If you did not create an account, no further action is required.</p>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AlumniNet Inc. All rights reserved.</p>
          <p class="link-alt">If the button doesn't work, copy and paste this link into your browser:<br>
          ${verificationLink}</p>
        </div>
      </div>
    </body>
    </html>
    `
  });
};

// send otp mail
const sendOTPEmail = async (to, otp, userName) => {
  await transporter.sendMail({
    from: `AlumniNet <noreply@alumninet.com>`,
    to,
    subject: 'Your Password Reset Code',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px; }
        .header { text-align: center; color: #4F46E5; }
        .otp-box { 
          background-color: #f3f4f6; 
          border: 2px dashed #4F46E5; 
          border-radius: 8px; 
          padding: 20px; 
          text-align: center; 
          margin: 20px 0;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          color: #111827;
        }
        .footer { font-size: 12px; color: #888; text-align: center; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <h4>Hi <strong>${userName}</strong>,</h4>
        <p>You requested to reset your password. This code is valid for <strong>5 minutes</strong>.</p>
        
        <div class="otp-box">
          ${otp}
        </div>
        
        <p>If you did not request this, please ignore this email or contact support if you have concerns.</p>
        
        <div class="footer" style="justify-content: center;">
          <p>&copy; ${new Date().getFullYear()} AlumniNet Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `
  });
};

// send reset link mail
const sendResetLinkEmail = async (to, token) => {
  const resetLink = `${dbConfig.appUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `AlumniNet <noreply@alumninet.com>`,
    to,
    subject: 'Reset your password',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 10px;
        }
        .header { text-align: center; padding-bottom: 20px; }
        .button-container { text-align: center; margin: 30px 0; }
        .button {
          background-color: #4F46E5;
          color: white !important;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          display: inline-block;
        }
        .footer { font-size: 12px; color: #888; text-align: center; margin-top: 30px; }
        .link-alt { word-break: break-all; font-size: 11px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
        </div>
        <p>Hello,</p>
        <p>We received a request to reset the password for your account. Click the button below to choose a new password:</p>
        
        <div class="button-container">
          <a href="${resetLink}" class="button">Reset Password</a>
        </div>
        
        <p>This secure link will <strong>expire in 15 minutes</strong>. If you did not make this request, your password will remain secure and you can safely ignore this message.</p>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AlumniNet Inc. All rights reserved.</p>
          <p class="link-alt">Trouble with the button? Copy and paste this URL into your browser:<br>
          ${resetLink}</p>
        </div>
      </div>
    </body>
    </html>
    `
  });
};

// send password reset success alert
const sendPasswordResetSuccessEmail = async (to) => {
  await transporter.sendMail({
    from: `AlumniNet <noreply@alumninet.com>`,
    to,
    subject: 'Security Notice: Password Changed Successfully',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 10px;
        }
        .header { text-align: center; padding-bottom: 20px; color: #10B981; }
        .footer { font-size: 12px; color: #888; text-align: center; margin-top: 30px; }
        .warning-box {
          background-color: #FEF2F2;
          border-left: 4px solid #EF4444;
          padding: 15px;
          margin-top: 20px;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Password Updated Successfully</h2>
        </div>
        <p>Hello,</p>
        <p>This is a confirmation notice that the password for your account has been successfully changed.</p>
        <p>You can now use your new password to log in to your dashboard.</p>
        
        <div class="warning-box">
          <strong style="color: #991B1B;">Didn't do this?</strong>
          <p style="margin: 5px 0 0 0; color: #7F1D1D; font-size: 14px;">
            If you did not make this change, please contact your System Administrator immediately to freeze your account.
          </p>
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AlumniNet Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `
  });
};

// email send certificate
const sendCertificateEmail = async (to, studentName, pdfBuffer) => {
  await transporter.sendMail({
    from: `AlumniNet <noreply@alumninet.com>`,
    to: to,
    subject: `Congratulations ${studentName}! Your Official Certificate has arrived.`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 10px;
        }
        .header { text-align: center; padding-bottom: 20px; color: #4F46E5; }
        .footer { font-size: 12px; color: #888; text-align: center; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Congratulations, ${studentName}! 🎉</h2>
        </div>
        <p>Hi there,</p>
        <p>We are incredibly proud to deliver your official graduation certificate. Your hard work, dedication, and achievements have brought you to this milestone!</p>
        
        <p>Your official printable PDF certificate is safely and securely attached to the bottom of this email layout for you to download, keep, and print at your convenience.</p>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AlumniNet Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `,
    attachments: [
      {
        filename: `Certificate_${studentName.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
};

module.exports = {
  sendVerificationEmail,
  sendOTPEmail,
  sendResetLinkEmail,
  sendPasswordResetSuccessEmail,
  sendCertificateEmail
};