import { extractTextFromResume, extractTextFromTxt } from '../services/textExtractionService.js';
import { matchResumeToJobDescription } from '../services/matchingService.js';
import { generateSuggestions } from '../services/suggestionsService.js';
import { supabaseAdmin, RESUME_BUCKET } from '../config/supabaseClient.js';

/**
 * POST /api/resumes/analyze
 * multipart/form-data: resume (file, required), jobDescriptionFile (file, optional),
 * jobDescriptionText (string, optional — required if no file given)
 */
export async function analyzeResume(req, res) {
  try {
    const resumeFile = req.files?.resume?.[0];
    const jdFile = req.files?.jobDescriptionFile?.[0];
    const jdText = req.body?.jobDescriptionText;

    if (!resumeFile) {
      return res.status(400).json({ error: 'Please upload a resume (PDF or DOCX).' });
    }

    const jobDescription = jdFile ? extractTextFromTxt(jdFile.buffer) : jdText;
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Please provide a job description (paste text or upload a .txt file).' });
    }

    const resumeText = await extractTextFromResume(resumeFile.buffer, resumeFile.mimetype);
    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: 'Could not extract any text from that resume. Try a different file.' });
    }

    // 1. Upload the original resume to Supabase Storage under the user's folder
    const storagePath = `${req.user.id}/${Date.now()}-${resumeFile.originalname}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from(RESUME_BUCKET)
      .upload(storagePath, resumeFile.buffer, { contentType: resumeFile.mimetype });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseAdmin.storage.from(RESUME_BUCKET).getPublicUrl(storagePath);

    // 2. Run the matching engine
    const match = matchResumeToJobDescription(resumeText, jobDescription);
    const suggestions = generateSuggestions({
      missingKeywords: match.missingKeywords,
      jdKeywords: match.jdKeywords,
      atsScore: match.atsScore,
    });

    // 3. Persist the report
    const { data: report, error: insertError } = await supabaseAdmin
      .from('reports')
      .insert({
        user_id: req.user.id,
        resume_name: resumeFile.originalname,
        resume_url: publicUrlData?.publicUrl || storagePath,
        job_description: jobDescription,
        ats_score: match.atsScore,
        keyword_match_pct: match.keywordMatchPct,
        skill_match_pct: match.skillMatchPct,
        experience_match_pct: match.experienceMatchPct,
        education_match_pct: match.educationMatchPct,
        matching_keywords: match.matchingKeywords,
        missing_keywords: match.missingKeywords,
        suggestions,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({ report });
  } catch (err) {
    console.error('analyzeResume error:', err);
    if (err.message === 'UNSUPPORTED_FILE_TYPE') {
      return res.status(400).json({ error: 'Only PDF and DOCX resumes are supported.' });
    }
    res.status(500).json({ error: 'Something went wrong while analyzing your resume. Please try again.' });
  }
}
