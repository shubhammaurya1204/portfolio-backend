// controllers/contactController.js
import ContactMessage from '../models/ContactMessage.js';
import transporter from '../config/mailer.js';
import { contactEmailTemplate, userConfirmationEmailTemplate } from '../templates/contactEmail.js';

// ─── POST /api/contact ───────────────────────────────────────────────────────
export const submitContactForm = async (req, res) => {
  try {
    const { fullName, name, email, phoneNumber, phone, service, message } = req.body;

    const resolvedName = fullName || name;
    const resolvedPhone = phoneNumber || phone;

    // Basic presence check
    if (!resolvedName || !email || !resolvedPhone || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    // 1. Save submission to MongoDB
    const newMessage = new ContactMessage({
      fullName: resolvedName,
      email,
      phoneNumber: resolvedPhone,
      service,
      message,
    });

    const saved = await newMessage.save();
    console.log(`[Contact DB] Message saved with ID: ${saved._id}`);

    // 2. Send admin email notification via Resend
    const adminEmailsRaw = process.env.ADMIN_EMAILS || '';
    const recipients = adminEmailsRaw
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    if (recipients.length > 0) {
      const adminMail = contactEmailTemplate({
        fullName: resolvedName,
        email,
        phoneNumber: resolvedPhone,
        service,
        message,
      });

      try {
        console.log(`[Contact Admin Mail] Sending notification to ${recipients.join(', ')}...`);
        await transporter.sendMail({
          to: recipients,
          subject: adminMail.subject,
          html: adminMail.html,
        });
        console.log(`[Contact Admin Mail SUCCESS] Notification sent to ${recipients.join(', ')}`);
      } catch (emailErr) {
        console.error('[Contact Admin Mail ERROR]', emailErr.message || emailErr);
      }
    }

    // 3. Send confirmation email to the user (commented out until domain is verified on Resend)
    /*
    if (email) {
      const userMail = userConfirmationEmailTemplate({
        fullName: resolvedName,
        service,
        message,
      });

      try {
        console.log(`[Contact User Confirmation Mail] Sending to ${email}...`);
        await transporter.sendMail({
          to: email,
          subject: userMail.subject,
          html: userMail.html,
        });
        console.log(`[Contact User Mail SUCCESS] Confirmation email sent to ${email}`);
      } catch (userEmailErr) {
        console.error('[Contact User Mail ERROR]', userEmailErr.message || userEmailErr);
      }
    }
    */

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! I will get back to you soon.',
      data: {
        id: saved._id,
        fullName: saved.fullName,
        email: saved.email,
        service: saved.service,
        createdAt: saved.createdAt,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
    }

    console.error('Contact form submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
      error: error.message,
    });
  }
};

// ─── GET /api/contact (admin: list all messages) ────────────────────────────
export const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages.',
      error: error.message,
    });
  }
};

// ─── DELETE /api/contact/:id (admin: delete a message) ───────────────────────
export const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete message.',
      error: error.message,
    });
  }
};
