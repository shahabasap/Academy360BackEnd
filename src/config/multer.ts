import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

// Set up multer storage with dynamic folder creation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';

    // Determine the destination based on the fieldname
    if (file.fieldname === 'photo') {
      uploadPath = 'uploads/profilePics';
    } else if (file.fieldname === 'ugCertificate' || file.fieldname === 'pgCertificate') {
      uploadPath = 'uploads/certificates';
    } else {
      uploadPath = 'uploads/otherFiles';
    }

    // Ensure the directory exists, create if it doesn't
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to allow specific mime types
const fileFilter = (req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimeTypes.some(type => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
  }
};

// Export the multer upload configuration
export const upload = multer({ storage, fileFilter });
