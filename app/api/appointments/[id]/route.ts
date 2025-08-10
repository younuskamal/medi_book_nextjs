import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppointmentStatus } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { status } = await req.json();
  if (!status || !Object.values(AppointmentStatus).includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
  });
  if (!appointment) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (user.role === 'DOCTOR') {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId: user.id! },
      select: { id: true },
    });
    if (!doctor || appointment.doctorId !== doctor.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const updated = await prisma.appointment.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(updated);
}
