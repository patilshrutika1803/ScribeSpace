const path = require('path');
const dotenv = require('dotenv');

const sendEmail = require('./utils/sendEmail');

// Load .env specifically for this script (fixes running with `node testEmail.js`)
dotenv.config({
  path: path.join(__dirname, '.env'),
});

async function run() {
  try {
    // TEMP DEBUG (keep for now per request)
    console.log('[testEmail] DEBUG TEST_EMAIL =', process.env.TEST_EMAIL);
    console.log(
      '[testEmail] DEBUG RESEND_API_KEY =',
      process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.slice(0, 6)}...` : ''
    );

    // Update this to the email address you want to receive the test.
    const to = process.env.TEST_EMAIL || process.env.EMAIL || '';



    if (!to) {
      console.error('Missing recipient email. Set TEST_EMAIL (or EMAIL) in environment variables.');
      return;
    }

    const subject = 'ScribeSpace Test Email';
    const html = `
      <h1>ScribeSpace Email Test</h1>
      <p>If you received this email, Resend is working correctly.</p>
    `;

    const response = await sendEmail(to, subject, html);
    console.log('Email sent successfully:', response);
  } catch (err) {
    console.error('Failed to send test email:', err);
  }
}

run();

