import { Resend } from 'resend';

// Only initialize Resend on the server and when API key exists
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Format a normalized phone number (digits only) for display.
 * Converts "5551234567" to "(555) 123-4567" or "15551234567" to "1 (555) 123-4567"
 */
function formatPhoneForDisplay(digits: string): string {
  // Handle 11-digit numbers starting with 1 (US country code)
  if (digits.length === 11 && digits.startsWith('1')) {
    const areaCode = digits.slice(1, 4);
    const exchange = digits.slice(4, 7);
    const subscriber = digits.slice(7, 11);
    return `1 (${areaCode}) ${exchange}-${subscriber}`;
  }
  // Handle standard 10-digit US numbers
  if (digits.length === 10) {
    const areaCode = digits.slice(0, 3);
    const exchange = digits.slice(3, 6);
    const subscriber = digits.slice(6, 10);
    return `(${areaCode}) ${exchange}-${subscriber}`;
  }
  // Fallback: return as-is if not a standard format
  return digits;
}

export interface PhotoLink {
  name: string;
  url: string | null; // null if signed URL generation failed
}

export interface QuoteEmailData {
  requestId: string;
  name: string;
  email?: string;
  phone: string;
  serviceType: string;
  location?: string;
  description: string;
  preferredContact?: string;
  fileCount: number;
  submittedAt: Date;
  photoLinks?: PhotoLink[]; // Optional array of photo links with signed URLs
}

/**
 * Escape HTML to prevent XSS when rendering user input
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Generate HTML for photo links section
 */
function generatePhotoLinksHtml(photoLinks: PhotoLink[]): string {
  if (!photoLinks || photoLinks.length === 0) {
    return '';
  }

  const linkItems = photoLinks
    .map((photo, index) => {
      if (photo.url) {
        return `
        <tr>
          <td style="padding: 8px 0;">
            <a href="${escapeHtml(photo.url)}" style="color: #990303; text-decoration: none;" target="_blank">
              📷 View Photo ${index + 1}
            </a>
            <span style="color: #666; font-size: 12px; margin-left: 8px;">(${escapeHtml(photo.name)})</span>
          </td>
        </tr>`;
      } else {
        return `
        <tr>
          <td style="padding: 8px 0; color: #666;">
            📷 Photo ${index + 1}: ${escapeHtml(photo.name)} <span style="color: #999;">(link unavailable)</span>
          </td>
        </tr>`;
      }
    })
    .join('');

  return `
    <div style="margin-top: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #292323;">Uploaded Photos:</h3>
      <div style="background: white; padding: 15px; border: 1px solid #e0e0e0;">
        <p style="margin: 0 0 10px 0; color: #666; font-size: 12px;">⏰ Links expire in 24 hours</p>
        <table style="width: 100%;">
          ${linkItems}
        </table>
      </div>
    </div>
  `;
}

/**
 * Generate plain text for photo links section
 */
function generatePhotoLinksText(photoLinks: PhotoLink[]): string {
  if (!photoLinks || photoLinks.length === 0) {
    return '';
  }

  const linkItems = photoLinks
    .map((photo, index) => {
      if (photo.url) {
        return `  - Photo ${index + 1} (${photo.name}): ${photo.url}`;
      } else {
        return `  - Photo ${index + 1}: ${photo.name} (link unavailable)`;
      }
    })
    .join('\n');

  return `
UPLOADED PHOTOS (links expire in 24 hours):
${linkItems}
`;
}

/**
 * Generate HTML email content for quote notification
 */
function generateQuoteEmailHtml(data: QuoteEmailData): string {
  const adminUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin/quotes`
    : null;

  const photoLinksHtml = data.photoLinks
    ? generatePhotoLinksHtml(data.photoLinks)
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #292323 0%, #71706e 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">New Quote Request</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; width: 140px;">Request ID:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-family: monospace;">${escapeHtml(data.requestId.slice(0, 8))}...</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Name:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${escapeHtml(data.name)}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Phone:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
          <a href="tel:+1${escapeHtml(data.phone.replace(/^1/, ''))}" style="color: #990303;">${escapeHtml(formatPhoneForDisplay(data.phone))}</a>
        </td>
      </tr>
      ${data.email ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Email:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
          <a href="mailto:${escapeHtml(data.email)}" style="color: #990303;">${escapeHtml(data.email)}</a>
        </td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Service Type:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${escapeHtml(data.serviceType)}</td>
      </tr>
      ${data.location ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Location:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${escapeHtml(data.location)}</td>
      </tr>
      ` : ''}
      ${data.preferredContact ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Preferred Contact:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${escapeHtml(data.preferredContact)}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Photos:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${data.fileCount > 0 ? `${data.fileCount} photo(s) uploaded` : 'None'}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Submitted:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">${data.submittedAt.toLocaleString('en-US', { timeZone: 'America/Chicago' })}</td>
      </tr>
    </table>

    <div style="margin-top: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #292323;">Project Description:</h3>
      <div style="background: white; padding: 15px; border: 1px solid #e0e0e0; white-space: pre-wrap;">${escapeHtml(data.description)}</div>
    </div>

    ${photoLinksHtml}

    ${adminUrl ? `
    <div style="margin-top: 30px; text-align: center;">
      <a href="${adminUrl}" style="display: inline-block; background: #990303; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold;">View in Admin Dashboard</a>
    </div>
    ` : ''}
  </div>

  <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
    <p>This is an automated notification from F&J's Stone Services website.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email content
 */
function generateQuoteEmailText(data: QuoteEmailData): string {
  const photoLinksText = data.photoLinks
    ? generatePhotoLinksText(data.photoLinks)
    : '';

  return `
NEW QUOTE REQUEST
==================

Request ID: ${data.requestId.slice(0, 8)}...
Name: ${data.name}
Phone: ${formatPhoneForDisplay(data.phone)}
${data.email ? `Email: ${data.email}` : ''}
Service Type: ${data.serviceType}
${data.location ? `Location: ${data.location}` : ''}
${data.preferredContact ? `Preferred Contact: ${data.preferredContact}` : ''}
Photos: ${data.fileCount > 0 ? `${data.fileCount} photo(s) uploaded` : 'None'}
Submitted: ${data.submittedAt.toLocaleString('en-US', { timeZone: 'America/Chicago' })}

PROJECT DESCRIPTION:
${data.description}
${photoLinksText}
---
This is an automated notification from F&J's Stone Services website.
  `.trim();
}

export interface SendQuoteEmailResult {
  success: boolean;
  error?: string;
}

/**
 * Send quote notification email
 */
export async function sendQuoteNotificationEmail(
  data: QuoteEmailData
): Promise<SendQuoteEmailResult> {
  // Check if Resend is configured
  if (!resend) {
    console.warn('Resend not configured - RESEND_API_KEY missing. Skipping email.');
    return { success: true }; // Don't fail the submission, just skip email
  }

  const emailTo = process.env.EMAIL_TO || 'fjstoneservices@gmail.com';
  const emailFrom = process.env.EMAIL_FROM || 'quotes@resend.dev'; // Default Resend sender for testing

  try {
    const { error } = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      replyTo: data.email || undefined,
      subject: `[Quote Request] ${data.serviceType} — ${data.name}`,
      html: generateQuoteEmailHtml(data),
      text: generateQuoteEmailText(data),
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Failed to send quote notification email:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
