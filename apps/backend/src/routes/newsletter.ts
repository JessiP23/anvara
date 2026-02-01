import { Router, type Response, type Request, IRouter } from 'express';

const router: IRouter = Router();
const subscribers = new Set<string>();

router.post('/subscribe', (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({
            error: "Email is required"
        })
    }

    const normalized = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return res.status(400).json({
            error: 'Invalid email format'
        })
    }

    if (subscribers.has(normalized)) {
        return res.status(400).json({
            error: "Already subscribed"
        })
    }

    subscribers.add(normalized);
    return res.json({
        success: true,
    })
})

export default router;