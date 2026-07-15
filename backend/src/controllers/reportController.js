import { supabaseAdmin } from '../config/supabaseClient.js';
import { streamAtsReportPdf } from '../services/pdfReportService.js';

// GET /api/reports — list current user's reports (supports ?search=&page=&pageSize=)
export async function listReports(req, res) {
  try {
    const { search = '', page = 1, pageSize = 10 } = req.query;
    const from = (Number(page) - 1) * Number(pageSize);
    const to = from + Number(pageSize) - 1;

    let query = supabaseAdmin
      .from('reports')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (search) {
      query = query.ilike('resume_name', `%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ reports: data, total: count });
  } catch (err) {
    console.error('listReports error:', err);
    res.status(500).json({ error: 'Could not load reports.' });
  }
}

// GET /api/reports/:id
export async function getReport(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Report not found.' });
    res.json({ report: data });
  } catch (err) {
    console.error('getReport error:', err);
    res.status(500).json({ error: 'Could not load report.' });
  }
}

// DELETE /api/reports/:id
export async function deleteReport(req, res) {
  try {
    const { error } = await supabaseAdmin
      .from('reports')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('deleteReport error:', err);
    res.status(500).json({ error: 'Could not delete report.' });
  }
}

// GET /api/reports/:id/pdf
export async function downloadReportPdf(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Report not found.' });
    streamAtsReportPdf(res, data);
  } catch (err) {
    console.error('downloadReportPdf error:', err);
    res.status(500).json({ error: 'Could not generate PDF report.' });
  }
}

// GET /api/reports/summary — dashboard stats
export async function getDashboardSummary(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('ats_score, created_at, resume_name')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const scores = data.map((r) => r.ats_score);
    const summary = {
      totalAnalyses: data.length,
      highestScore: scores.length ? Math.max(...scores) : 0,
      averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      recent: data.slice(0, 5),
    };

    res.json({ summary });
  } catch (err) {
    console.error('getDashboardSummary error:', err);
    res.status(500).json({ error: 'Could not load dashboard summary.' });
  }
}
