// routes/contact.js
import express from 'express';
import { submitContactForm, getAllMessages, deleteMessage } from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact — submit contact form
router.post('/', submitContactForm);

// GET /api/contact — list all messages (admin use)
router.get('/', getAllMessages);

// DELETE /api/contact/:id — delete a message
router.delete('/:id', deleteMessage);

export default router;
