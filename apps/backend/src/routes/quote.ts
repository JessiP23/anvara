import { IRouter, Router, type Request, type Response } from "express";
import { randomUUID } from 'crypto'

const router : IRouter = Router();
const quotes = new Map<string, object>();

router.post('/request', (req: Request, res: Response) => {
    const { adSlotId, companyName, email, message } = req.body;

    if (!adSlotId) return res.status(400).json({ error: 'Ad slot is required' });
    if (!companyName?.trim()) return res.status(400).json({ error: 'Company name is required' });
    if (!email?.trim()) return res.status(400).json({ error: 'Email is required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!message?.trim()) return res.status(400).json({ error: 'Requirements are required' });

    const quoteId = randomUUID().slice(0, 8);
    quotes.set(quoteId, { ...req.body, quoteId, createdAt: new Date() });

    return res.json({ success: true, quoteId });
})

export default router;