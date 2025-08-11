import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const doctors = await prisma.doctorProfile.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { user: { name: 'asc' } },
  });
  return NextResponse.json(
    doctors.map((d) => ({ id: d.id, name: d.user?.name ?? '' }))
  );
}
