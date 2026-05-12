import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../services/db';
import { generateReport } from '../services/deepseek';

const router = Router();

router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object' || Object.keys(answers).length < 3) {
      return res.status(400).json({ error: '请至少回答3道题' });
    }

    const reportId = uuid().slice(0, 8);
    const answersJson = JSON.stringify(answers);
    const report = await generateReport(answers);
    const content = JSON.stringify(report);

    const preview = {
      ...report,
      analysis: report.analysis.slice(0, Math.floor(report.analysis.length * 0.3)) + '...',
      strengths: report.strengths.slice(0, Math.floor(report.strengths.length * 0.3)) + '...',
      growth: report.growth.slice(0, Math.floor(report.growth.length * 0.3)) + '...',
      love_advice: report.love_advice.slice(0, Math.floor(report.love_advice.length * 0.3)) + '...',
    };

    db.prepare(
      `INSERT INTO reports (id, answers, archetype, content, preview_content, unlocked)
       VALUES (?, ?, ?, ?, ?, 0)`
    ).run(reportId, answersJson, report.archetype, content, JSON.stringify(preview));

    return res.status(201).json({ reportId, preview, unlocked: false });
  } catch (error: any) {
    console.error('Quiz submit error:', error);
    return res.status(500).json({ error: '生成报告失败，请稍后重试' });
  }
});

export default router;
