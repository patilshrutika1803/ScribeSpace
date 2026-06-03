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

    return response;
  } catch (err) {
    // Preserve original error details for upstream logging/handling
    const message = err && err.message ? err.message : 'Failed to send email';
    const enhancedError = new Error(message);
    enhancedError.cause = err;
    throw enhancedError;
  }
}

module.exports = sendEmail;

