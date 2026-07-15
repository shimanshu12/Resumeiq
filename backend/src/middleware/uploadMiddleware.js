import multer from 'multer';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
]);

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error('INVALID_FILE_TYPE'), false);
  }
  cb(null, true);
}

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Friendly error translator used in route handlers
export function multerErrorMessage(err) {
  if (err.message === 'INVALID_FILE_TYPE') {
    return 'Only PDF and DOCX files are supported.';
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return 'File is too large. Max size is 5MB.';
  }
  return 'Could not process the uploaded file.';
}
