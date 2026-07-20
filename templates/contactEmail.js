// templates/contactEmail.js

/**
 * Builds the admin notification email for a contact form submission.
 * @param {{ fullName, email, phoneNumber, service, message }} data
 * @returns {{ subject: string, html: string }}
 */
export const contactEmailTemplate = ({ fullName, email, phoneNumber, service, message }) => ({
  subject: `New Inquiry from ${fullName} — Portfolio Contact`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Submission</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Space Grotesk','Segoe UI',Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background-color:#121212;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);box-shadow:0 8px 32px rgba(0,0,0,0.5);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg, #ff8c00, #ffb74d);padding:24px 40px;text-align:center;">
              <h1 style="margin:0;color:#000000;font-size:22px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">
                New Inquiry For Work
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 16px;color:#ffffff;font-size:18px;font-weight:600;">
                Submission Details
              </h2>

              <!-- Details Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-collapse:collapse;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#ff8c00;font-weight:600;font-size:13px;width:35%;text-transform:uppercase;">Full Name:</td>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#e5e5e5;font-size:14px;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#ff8c00;font-weight:600;font-size:13px;text-transform:uppercase;">Email:</td>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#e5e5e5;font-size:14px;">
                    <a href="mailto:${email}" style="color:#ffb74d;text-decoration:none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#ff8c00;font-weight:600;font-size:13px;text-transform:uppercase;">Phone Number:</td>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#e5e5e5;font-size:14px;">
                    <a href="tel:${phoneNumber}" style="color:#ffb74d;text-decoration:none;">${phoneNumber || "N/A"}</a>
                  </td>
                </tr>
                ${service ? `
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#ff8c00;font-weight:600;font-size:13px;text-transform:uppercase;">Requested Service:</td>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#e5e5e5;font-size:14px;">${service}</td>
                </tr>
                ` : ""}
              </table>

              <!-- Message box -->
              <h3 style="margin:20px 0 10px;color:#ffffff;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Message:</h3>
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background-color:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px;color:#d4d4d4;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message || "—"}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0d0d0d;border-top:1px solid rgba(255,255,255,0.05);padding:16px 40px;text-align:center;">
              <p style="margin:0;color:#737373;font-size:12px;">
                Automated notification from your Portfolio contact form.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
});

/**
 * Builds the user confirmation email sent back to the visitor.
 * @param {{ fullName, service, message }} data
 * @returns {{ subject: string, html: string }}
 */
export const userConfirmationEmailTemplate = ({ fullName, service, message }) => ({
  subject: `Thank you for reaching out! — Shubham Maurya`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You for Contacting</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Space Grotesk','Segoe UI',Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background-color:#121212;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);box-shadow:0 8px 32px rgba(0,0,0,0.5);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg, #ff8c00, #ffb74d);padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#000000;font-size:22px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">
                Thank You For Getting In Touch
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;color:#ffffff;font-size:16px;font-weight:600;">
                Hi ${fullName},
              </p>
              <p style="margin:0 0 20px;color:#d4d4d4;font-size:14px;line-height:1.6;">
                Thank you for contacting me! I have received your message regarding <strong style="color:#ff8c00;">${service || "your project"}</strong> and will get back to you within <strong>24 hours</strong>.
              </p>

              <!-- Summary Card -->
              <h3 style="margin:24px 0 12px;color:#ffffff;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Summary of your message:</h3>
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background-color:#1a1a1a;border:1px solid rgba(255,255,255,0.08);border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px;color:#a3a3a3;font-size:13px;line-height:1.6;white-space:pre-wrap;">${message}</td>
                </tr>
              </table>

              <p style="margin:0;color:#d4d4d4;font-size:14px;line-height:1.6;">
                Looking forward to connecting with you!
              </p>
              <p style="margin:20px 0 0;color:#ff8c00;font-size:14px;font-weight:600;">
                Best regards,<br/>
                <span style="color:#ffffff;font-size:15px;">Shubham Maurya</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0d0d0d;border-top:1px solid rgba(255,255,255,0.05);padding:16px 40px;text-align:center;">
              <p style="margin:0;color:#737373;font-size:12px;">
                This is an automated confirmation email from Shubham Maurya's Portfolio.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
});
