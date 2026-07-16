import { supabaseAdmin } from '../config/supabaseClient.js';

/**
 * Verifies the Supabase-issued JWT on the Authorization header
 * (Authorization: Bearer <access_token>) and attaches the user to req.user.
 * Also supports the token via query string (?token=...) for cases like
 * opening a PDF download in a new tab, where headers can't be attached.
 * Protects every route that touches resumes/reports.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token && typeof req.query?.token === 'string' && req.query.token.trim()) {
      token = req.query.token.trim();
    }

    if (!token) {
      return res.status(401).json({ error: 'Missing authentication token.' });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Authentication check failed.' });
  }
}
