import { Router, type Response, type IRouter } from 'express';
import { prisma, CampaignStatus } from '../db.js';
import { getParam } from '../utils/helpers.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireSponsor } from '../middleware/role.middleware.js';
import type { AuthRequest } from '../types/auth.types.js';
import { Prisma } from '../generated/prisma/client.js';

const router: IRouter = Router();

// GET /api/campaigns - List all campaigns
router.get('/', requireAuth, requireSponsor, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    // Data scoping: Only return campaigns belonging to this sponsor
    const campaigns = await prisma.campaign.findMany({
      where: {
        sponsorId: req.user!.sponsorId!, // Safe because requireSponsor ensures this exists
        ...(status && { status: status as 'ACTIVE' | 'PAUSED' | 'COMPLETED' }),
      },
      include: {
        sponsor: { select: { id: true, name: true, logo: true } },
        _count: { select: { creatives: true, placements: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// GET /api/campaigns/:id - Get single campaign with details
router.get('/:id', requireAuth, requireSponsor, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        sponsor: true,
        creatives: true,
        placements: {
          include: {
            adSlot: true,
            publisher: { select: { id: true, name: true, category: true } },
          },
        },
      },
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    // Ownership check: Does this campaign belong to the authenticated user?
    if (campaign.sponsorId !== req.user!.sponsorId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// POST /api/campaigns - Create new campaign
router.post('/', requireAuth, requireSponsor, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, budget, cpmRate, cpcRate, startDate, endDate, targetCategories, targetRegions } =
      req.body;

    if (!name || !budget || !startDate || !endDate) {
      res.status(400).json({
        error: 'Name, budget, startDate, and endDate are required',
      });
      return;
    }

    // Use authenticated user's sponsorId - don't trust request body
    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        budget,
        cpmRate,
        cpcRate,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetCategories: targetCategories || [],
        targetRegions: targetRegions || [],
        sponsorId: req.user!.sponsorId!, // From authenticated user, not request body
      },
      include: {
        sponsor: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

const campaignInclude = {
  sponsor: { select: { id: true, name: true } },
  _count: { select: { creatives: true, placements: true } },
} as const;

const pickDefined = <T extends Record<string, unknown>>(obj: T): Partial<T> => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;

// Update campaign details (name, budget, dates, status, etc.)
router.put('/:id', requireAuth, requireSponsor, async (req: AuthRequest, res: Response) => {
  try {
    const { status, budget, startDate, endDate } = req.body;

    if (status && !Object.values(CampaignStatus).includes(status)) {
      res.status(400).json({ error: 'Invalid campaign status' });
      return;
    }

    if (budget !== undefined && (typeof budget !== 'number' || budget < 0)) {
      res.status(400).json({ error: 'Budget must be a non-negative number' });
      return;
    }

    const data = pickDefined({
      ...req.body,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    })

    const campaign = await prisma.campaign.update({
      where: { id: getParam(req.params.id), sponsorId: req.user!.sponsorId! },
      data,
      include: campaignInclude,
    })
    res.json(campaign);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
})

router.delete('/:id', requireAuth, requireSponsor, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.campaign.delete({
      where: { id: getParam(req.params.id), sponsorId: req.user!.sponsorId! },
    });
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});


export default router;
