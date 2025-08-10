import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (user.role === 'DOCTOR') {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId: user.id! },
      select: { id: true },
    });
    if (!doctor) return NextResponse.json([]);
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      orderBy: { startsAtUTC: 'asc' },
    });
    return NextResponse.json(appointments);
  }

  if (user.role === 'PATIENT') {
    const patient = await prisma.patientProfile.findUnique({
      where: { userId: user.id! },
      select: { id: true },
    });
    if (!patient) return NextResponse.json([]);
    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      orderBy: { startsAtUTC: 'asc' },
    });
    return NextResponse.json(appointments);
  }

  const appointments = await prisma.appointment.findMany({
    orderBy: { startsAtUTC: 'asc' },
  });
  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user || user.role !== 'PATIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { doctorId, startsAtUTC, endsAtUTC } = await req.json();
  if (!doctorId || !startsAtUTC || !endsAtUTC) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const overlapping = await prisma.appointment.findFirst({
    where: {
      doctorId,
      OR: [
        {
          startsAtUTC: { lt: new Date(endsAtUTC) },
          endsAtUTC: { gt: new Date(startsAtUTC) },
        },
      ],
    },
  });

  if (overlapping) {
    return NextResponse.json({ error: 'Time slot unavailable' }, { status: 400 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      doctorId,
      patientId: user.id!,
      startsAtUTC: new Date(startsAtUTC),
      endsAtUTC: new Date(endsAtUTC),
    },
  });

  return NextResponse.json(appointment);
}
