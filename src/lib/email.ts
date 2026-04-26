// Email service using Resend (recommended) or fallback to console logging
// Set RESEND_API_KEY in env to enable real email sending

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@nightshift.dev';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  // Log all emails in development
  console.log('[EMAIL]', {
    to: payload.to,
    subject: payload.subject,
    html: payload.html.substring(0, 200) + '...',
  });

  // If no API key, just log (for development)
  if (!RESEND_API_KEY) {
    console.log('[EMAIL] No RESEND_API_KEY set, email logged but not sent');
    return { success: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[EMAIL] Resend API error:', error);
      return { success: false, error };
    }

    const data = await response.json();
    console.log('[EMAIL] Sent successfully:', data.id);
    return { success: true };
  } catch (error) {
    console.error('[EMAIL] Failed to send:', error);
    return { success: false, error: String(error) };
  }
}

// Customer notification templates
export const notificationTemplates = {
  shipped: (featureTitle: string, deployedUrl: string) => ({
    subject: `✅ Your feature "${featureTitle}" is live!`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #10b981; margin-bottom: 16px;">🚀 Your feature is live!</h2>
        <p>Great news! The feature you requested — <strong>${featureTitle}</strong> — has been built and deployed.</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <a href="${deployedUrl}" style="color: #3b82f6; font-weight: 600; font-size: 16px;">${deployedUrl}</a>
        </div>
        <h3 style="margin-top: 24px;">What was built:</h3>
        <ul>
          <li>Complete implementation based on your requirements</li>
          <li>Fully tested and production-ready</li>
          <li>Quality gates passed (TypeScript, ESLint, Build)</li>
        </ul>
        <h3 style="margin-top: 24px;">Next steps:</h3>
        <ol>
          <li>Try it out at the link above</li>
          <li>Let us know if you need any adjustments</li>
          <li>Consider what you'd like built next</li>
        </ol>
        <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">Questions? Just reply to this email.</p>
        <p style="color: #6b7280; font-size: 14px;">— The Night Shift Team</p>
      </div>
    `,
  }),

  review: (featureTitle: string, prUrl: string) => ({
    subject: `👀 "${featureTitle}" is ready for your review`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #8b5cf6; margin-bottom: 16px;">Your feature is ready for review</h2>
        <p>Your feature <strong>${featureTitle}</strong> is built and ready for review.</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <a href="${prUrl}" style="color: #3b82f6; font-weight: 600; font-size: 16px;">View Pull Request</a>
        </div>
        <h3 style="margin-top: 24px;">Review checklist:</h3>
        <ul>
          <li>☐ Code meets your standards</li>
          <li>☐ Feature works as expected</li>
          <li>☐ Ready to deploy to production</li>
        </ul>
        <p style="margin-top: 24px;">Once you approve, we'll deploy it immediately.</p>
        <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">— The Night Shift Team</p>
      </div>
    `,
  }),
};
