// controllers/resumeController.js
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import Resume from '../models/Resume.js';
import axios from 'axios';

const RESUME_PUBLIC_ID = 'portfolio/resume/shubham_maurya_resume';

// ─── Helper: upload buffer to Cloudinary ─────────────────────────────────────
const uploadBufferToCloudinary = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// ─── POST /api/resume/upload ─────────────────────────────────────────────────
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // 1. Upload to Cloudinary
    const result = await uploadBufferToCloudinary(req.file.buffer, RESUME_PUBLIC_ID);

    // 2. Save/Update the URL in MongoDB
    // Delete all existing resumes first to ensure only one exists
    await Resume.deleteMany({});
    
    const newResume = new Resume({
      url: result.secure_url, 
      public_id: result.public_id 
    });
    const savedResume = await newResume.save();

    return res.status(200).json({
      success: true,
      message: 'Resume uploaded and saved to database successfully.',
      resume: savedResume
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Upload failed.', 
      error: error.message 
    });
  }
};

// Helper function to determine file info based on public_id or URL
const getFileInfo = (url, publicId) => {
  // Check for PDF, DOC, DOCX
  if (url.includes('.pdf') || publicId.includes('.pdf')) {
    return {
      contentType: 'application/pdf',
      fileName: 'Shubham_Maurya_Resume.pdf'
    };
  } else if (url.includes('.docx') || publicId.includes('.docx')) {
    return {
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileName: 'Shubham_Maurya_Resume.docx'
    };
  } else if (url.includes('.doc') || publicId.includes('.doc')) {
    return {
      contentType: 'application/msword',
      fileName: 'Shubham_Maurya_Resume.doc'
    };
  }
  // Default to PDF if we can't determine
  return {
    contentType: 'application/pdf',
    fileName: 'Shubham_Maurya_Resume.pdf'
  };
};

// ─── GET /api/resume/download ────────────────────────────────────────────────
export const downloadResume = async (req, res) => {
  try {
    const resumeData = await Resume.findOne().lean();

    if (!resumeData || !resumeData.url) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found in database. Please upload it first.',
      });
    }

    const fileInfo = getFileInfo(resumeData.url, resumeData.public_id);

    // Fetch the file from Cloudinary and pipe it to the response as a download
    const response = await axios.get(resumeData.url, { responseType: 'stream' });
    
    // Set headers for file download
    res.setHeader('Content-Type', fileInfo.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.fileName}"`);
    
    // Pipe the Cloudinary response stream to the client
    response.data.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({
      success: false,
      message: 'Download failed.',
      error: error.message,
    });
  }
};