// models/Resume.js
import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);