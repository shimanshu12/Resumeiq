import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

/**
 * Extracts plain text from an uploaded resume buffer.
 * @param {Buffer} buffer - raw file bytes
 * @param {string} mimetype - the file's MIME type
 * @returns {Promise<string>} extracted text
 */
export async function extractTextFromResume(buffer, mimetype) {
  if (mimetype === 'application/pdf') {
    const { text } = await pdfParse(buffer);
    return text || '';
  }

  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const { value } = await mammoth.extractRawText({ buffer });
    return value || '';
  }

  throw new Error('UNSUPPORTED_FILE_TYPE');
}

/**
 * Extracts plain text from an uploaded job-description .txt buffer.
 */
export function extractTextFromTxt(buffer) {
  return buffer.toString('utf-8');
}
