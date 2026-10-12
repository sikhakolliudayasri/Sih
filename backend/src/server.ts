import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { schemesRouter } from './routes/schemes.js';
import { eligibilityRouter } from './routes/eligibility.js';
//import { combinationRouter } from './routes/combination.js';
import { copilotRouter } from './routes/copilot.js';
import { feedbackRouter } from './routes/feedback.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const normalizeMobile = (value: string) => value.replace(/\D/g, '').slice(-10);
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const buildOtpMessage = (otp: string) => `Your Bharat Benefits one-time password is ${otp}. Valid for 5 minutes.`;

const sendOtpWithProvider = async (mobile: string, otp: string) => {
  const authKey = process.env.OTP_API_KEY || process.env.MSG91_API_KEY || process.env.MSG91_AUTH_KEY || '';
  const senderId = process.env.OTP_SENDER_ID || process.env.MSG91_SENDER_ID || 'BBNOTP';
  const provider = (process.env.OTP_PROVIDER || process.env.SMS_PROVIDER || '').toLowerCase();

  if (!authKey && !process.env.FAST2SMS_API_KEY && !process.env.TWILIO_ACCOUNT_SID) {
    return {
      demoOtp: otp,
      message: 'OTP sent in demo mode. No live SMS credentials were configured.'
    };
  }

  if (provider === 'msg91' || (provider !== 'fast2sms' && provider !== 'twilio' && authKey)) {
    const url = new URL('https://control.msg91.com/api/sendhttp.php');
    url.searchParams.set('authkey', authKey);
    url.searchParams.set('mobiles', mobile);
    url.searchParams.set('message', buildOtpMessage(otp));
    url.searchParams.set('sender', senderId);
    url.searchParams.set('route', '4');
    url.searchParams.set('country', '91');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('MSG91 OTP request failed.');
    }

    return { message: 'OTP sent via MSG91.' };
  }

  if (provider === 'fast2sms' || process.env.FAST2SMS_API_KEY) {
    const apiKey = process.env.FAST2SMS_API_KEY || '';
    const payload = {
      route: 'q',
      message: buildOtpMessage(otp),
      numbers: mobile,
      flash: 0,
      sender_id: process.env.FAST2SMS_SENDER_ID || senderId
    };

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: apiKey,
        accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Fast2SMS OTP request failed.');
    }

    return { message: 'OTP sent via Fast2SMS.' };
  }

  if (provider === 'twilio' || process.env.TWILIO_ACCOUNT_SID) {
    const sid = process.env.TWILIO_ACCOUNT_SID || '';
    const token = process.env.TWILIO_AUTH_TOKEN || '';
    const from = process.env.TWILIO_FROM_NUMBER || '';

    const auth = Buffer.from(`${sid}:${token}`).toString('base64');
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams({
        To: `+91${mobile}`,
        From: from,
        Body: buildOtpMessage(otp)
      })
    });

    if (!response.ok) {
      throw new Error('Twilio OTP request failed.');
    }

    return { message: 'OTP sent via Twilio.' };
  }

  return {
    demoOtp: otp,
    message: 'OTP generated. Configure SMS keys to send actual messages.'
  };
};

app.disable('x-powered-by');
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'Bharat Benefits Navigator API',
    schemes: 15,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.post('/api/auth/send-otp', async (req, res) => {
  const mobile = normalizeMobile(String(req.body?.mobile || ''));
  if (!mobile || mobile.length !== 10) {
    return res.status(400).json({ error: 'A valid 10-digit mobile number is required.' });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(mobile, { otp, expiresAt });

  try {
    const result = await sendOtpWithProvider(mobile, otp);
    return res.json({ ok: true, ...result, mobile, otp: result.demoOtp || undefined });
  } catch (error) {
    console.error('OTP send failed:', error);
    return res.status(500).json({ error: 'Unable to send OTP. Please try again.' });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  const mobile = normalizeMobile(String(req.body?.mobile || ''));
  const otp = String(req.body?.otp || '');

  if (!mobile || !otp) {
    return res.status(400).json({ error: 'Mobile number and OTP are required.' });
  }

  const stored = otpStore.get(mobile);
  if (!stored) {
    return res.status(400).json({ error: 'OTP expired or not generated for this mobile number.' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(mobile);
    return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP. Please enter the correct code.' });
  }

  otpStore.delete(mobile);
  return res.json({ ok: true, verified: true, message: 'OTP verified successfully.' });
});

app.use('/api/schemes', schemesRouter);
app.use('/api/eligibility', eligibilityRouter);
//app.use('/api/combination', combinationRouter);
app.use('/api/copilot', copilotRouter);
app.use('/api/feedback', feedbackRouter);
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist, { index: false }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Bharat Benefits Navigator backend running on http://localhost:${port}`);
});
