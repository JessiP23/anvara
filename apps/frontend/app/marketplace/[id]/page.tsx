import { AdSlotDetail } from './components/ad-slot-detail';
import { notFound } from 'next/navigation';
import { getServerAdSlot } from '@/lib/server-api/helper';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const adSlot = await getServerAdSlot(id);
  if (!adSlot) {
    return {
      title: 'Ad Slot Not Found',
    }
  }

  return {
    title: adSlot.name,
    description: adSlot.description || `${adSlot.type} ad slot - $${adSlot.basePrice}/mo`
  }
}

export default async function AdSlotPage({ params }: Props) {
  const { id } = await params;

  if (!id || id.length < 5) {
    notFound();
  }

  const adSlot = await getServerAdSlot(id);
  if (!adSlot) {
    notFound();
  }

  return <AdSlotDetail id={id} />;
}
