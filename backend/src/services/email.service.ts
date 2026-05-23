import nodemailer from 'nodemailer';

function createTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendPasswordResetEmail(to: string, rawToken: string): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

  const transporter = createTransport();

  await transporter.sendMail({
    from: `"NexVPN" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Reset your NexVPN password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#00D4FF">Reset your password</h2>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#00D4FF;color:#05080D;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
          Reset Password
        </a>
        <p style="color:#666;font-size:12px;margin-top:24px">
          If you didn't request this, ignore this email. Your password won't change.
        </p>
      </div>
    `,
  });
}
