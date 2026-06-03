const { Resend } = require('resend');

/**
 * Send an email via Resend.
 *
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @returns {Promise<any>} Resend response
 */
async function sendEmail(to, subject, html) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const hasResendApiKey = Boolean(resendApiKey);

    // Detailed pre-send logging (never print the full API key)
    console.log('[sendEmail] Preparing to send email');
    console.log('[sendEmail] recipient(to)=', to);
    console.log('[sendEmail] RESEND_API_KEY exists=', hasResendApiKey);

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not set');
    }

    const resend = new Resend(resendApiKey);

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });

    // Detailed post-send logging
    console.log('[sendEmail] Resend response received:', response);

    return response;
  } catch (err) {
    // Detailed error logging
    console.error('[sendEmail] Resend send failed');

    const message = err && err.message ? err.message : 'Failed to send email';
    const name = err && err.name ? err.name : undefined;
    const statusCode = err && err.statusCode ? err.statusCode : undefined;
    const responseBody = err && err.response && err.response.body ? err.response.body : undefined;

    console.error('[sendEmail] error.message=', message);
    console.error('[sendEmail] error.name=', name);
    console.error('[sendEmail] error.statusCode=', statusCode);
    console.error('[sendEmail] error.response.body=', responseBody);

    // Log the complete error object (best effort; might include circular refs)
    try {
      console.error('[sendEmail] full error object=', err);
    } catch (e) {
      // ignore logging issues
    }

    // Log any nested error fields if present
    if (err && err.error) {
      console.error('[sendEmail] error.error=', err.error);
    }
    if (err && err.details) {
      console.error('[sendEmail] error.details=', err.details);
    }

    // Re-throw the original error after logging
    throw err;
  }
}

module.exports = sendEmail;

