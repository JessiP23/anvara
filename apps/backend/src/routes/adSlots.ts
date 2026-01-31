import { Router, type Response, type IRouter } from 'express';
import { AdSlotType, prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';
import { requireAuth } from '../middleware/auth.middleware.js';
// import { optionalAuth } from '../middleware/auth.middleware.js';
import { requirePublisher } from '../middleware/role.middleware.js';
import type { AuthRequest } from '../types/auth.types.js';
import { Prisma } from '../generated/prisma/client.js';

const router: IRouter = Router();

// GET /api/ad-slots - List available ad slots
// IMPORTANT: If needed to be public just switch to OptionalAuth
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { publisherId, type, available } = req.query;

    // If user is a publisher and no publisherId specified, show only their slots
    const effectivePublisherId =
      req.user?.role === 'PUBLISHER' && !publisherId ? req.user.publisherId : getParam(publisherId);

    const adSlots = await prisma.adSlot.findMany({
      where: {
        ...(effectivePublisherId && { publisherId: effectivePublisherId }),
        ...(type && { type: type as 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST' }),
        ...(available === 'true' && { isAvailable: true }),
      },
      include: {
        publisher: { select: { id: true, name: true, category: true, monthlyViews: true } },
        _count: { select: { placements: true } },
      },
      orderBy: { basePrice: 'desc' },
    });

    res.json(adSlots);
  } catch (error) {
    console.error('Error fetching ad slots:', error);
    res.status(500).json({ error: 'Failed to fetch ad slots' });
  }
});

// GET /api/ad-slots/:id - Get single ad slot with details
// IMPORTANT: If needed to be public just switch to OptionalAuth
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const adSlot = await prisma.adSlot.findFirst({
      where: { id, ...(req.user!.role === 'PUBLISHER' && {publisherId: req.user!.publisherId!}) },
      include: {
        publisher: true,
        placements: {
          include: {
            campaign: { select: { id: true, name: true, status: true } },
          },
        },
      },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    res.json(adSlot);
  } catch (error) {
    console.error('Error fetching ad slot:', error);
    res.status(500).json({ error: 'Failed to fetch ad slot' });
  }
});

// POST /api/ad-slots - Create new ad slot
// BUG: This accepts 'dimensions' and 'pricingModel' fields that don't exist in Prisma schema
// BUG: No input validation for basePrice (could be negative or zero)
router.post('/', requireAuth, requirePublisher, async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, basePrice, description, position, width, height, cpmFloor, isAvailable } = req.body;

    if (!name || !type || !basePrice) {
      res.status(400).json({
        error: 'Name, type, and basePrice are required',
      });
      return;
    }

    if (typeof basePrice !== 'number' || basePrice <= 0) {
      res.status(400).json({ error: 'basePrice must be a positive number' });
      return;
    }

    if (!Object.values(AdSlotType).includes(type)) {
      res.status(400).json({ error: 'Invalid ad slot type' });
      return;
    }

    const data: Prisma.AdSlotUncheckedCreateInput = {
      name,
      type,
      basePrice,
      publisherId: req.user!.publisherId!,
      ...pickDefined({ description, position, width, height, cpmFloor, isAvailable }),
    }

    const adSlot = await prisma.adSlot.create({
      data,
      include: adSlotInclude,
    });

    res.status(201).json(adSlot);
  } catch (error) {
    console.error('Error creating ad slot:', error);
    res.status(500).json({ error: 'Failed to create ad slot' });
  }
});

// POST /api/ad-slots/:id/book - Book an ad slot (simplified booking flow)
// This marks the slot as unavailable and creates a simple booking record
router.post('/:id/book', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { message } = req.body;

    // Sponsors book ad slots
    if (req.user!.role !== 'SPONSOR') {
      res.status(403).json({ error: 'Only sponsors can book ad slots' });
      return;
    }

    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (!adSlot.isAvailable) {
      res.status(400).json({ error: 'Ad slot is no longer available' });
      return;
    }

    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: false },
      include: adSlotInclude,
    });

    console.log(`Ad slot ${id} booked by sponsor ${req.user!.sponsorId}. Message: ${message || 'None'}`);

    res.json({
      success: true,
      message: 'Ad slot booked successfully!',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error booking ad slot:', error);
    res.status(500).json({ error: 'Failed to book ad slot' });
  }
});

// POST /api/ad-slots/:id/unbook - Reset ad slot to available (for testing)
router.post('/:id/unbook', requireAuth, requirePublisher, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Verify ownership
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      select: { publisherId: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (adSlot.publisherId !== req.user!.publisherId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: true },
      include: adSlotInclude
    });

    res.json({
      success: true,
      message: 'Ad slot is now available again',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error unbooking ad slot:', error);
    res.status(500).json({ error: 'Failed to unbook ad slot' });
  }
});

const adSlotInclude = {
  publisher: { select: { id: true, name: true } }
} as const;

const pickDefined = <T extends Record<string, unknown>>(obj: T): Partial<T> => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;

router.put('/:id', requireAuth, requirePublisher, async (req: AuthRequest, res: Response) => {
  try {
    const { type, basePrice, width, height } = req.body;

    if (type && !Object.values(AdSlotType).includes(type)) {
      res.status(400).json({ error: 'Invalid ad slot type' });
      return;
    }

    if (basePrice !== undefined && (typeof basePrice !== 'number' || basePrice <= 0)) {
      res.status(400).json({ error: 'basePrice must be a positive number' });
      return;
    }

    if ((width !== undefined && width <= 0) || (height !== undefined && height <= 0)) {
      res.status(400).json({ error: 'Width and height must be positive numbers' });
      return;
    }

    const adSlot = await prisma.adSlot.update({
      where: { id: getParam(req.params.id), publisherId: req.user!.publisherId! },
      data: pickDefined(req.body),
      include: adSlotInclude,
    });
    res.json(adSlot);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }
    console.error('Error updating ad slot:', error);
    res.status(500).json({ error: 'Failed to update ad slot' });
  }
});


router.delete('/:id', requireAuth, requirePublisher, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.adSlot.delete({
      where: { id: getParam(req.params.id), publisherId: req.user!.publisherId! },
    });
    res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }
    console.error('Error deleting ad slot:', error);
    res.status(500).json({ error: 'Failed to delete ad slot' });
  }
});

export default router;