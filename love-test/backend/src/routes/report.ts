import { Router, Request, Response } from 'express';
import db from '../services/db';

const router = Router();

function toJSON(val: any) {
  if (typeof val === 'string') return JSON.parse(val);
  return val;
}

router.get('/:id', (req: Request, res: Response) => {
  try {
    const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id) as any;
    if (!row) return res.status(404).json({ error: '报告不存在' });

    if (row.unlocked) {
      return res.json({ reportId: row.id, content: toJSON(row.content), unlocked: true });
    }
    return res.json({ reportId: row.id, preview: toJSON(row.preview_content), unlocked: false });
  } catch (error) {
    console.error('Get report error:', error);
    return res.status(500).json({ error: '获取报告失败' });
  }
});

router.post('/:id/unlock', (req: Request, res: Response) => {
  try {
    const row = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id) as any;
    if (!row) return res.status(404).json({ error: '报告不存在' });

    db.prepare('UPDATE reports SET unlocked = 1 WHERE id = ?').run(req.params.id);

    return res.json({ reportId: row.id, content: toJSON(row.content), unlocked: true });
  } catch (error) {
    console.error('Unlock error:', error);
    return res.status(500).json({ error: '解锁失败' });
  }
});

export default router;
