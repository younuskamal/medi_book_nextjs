import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AppointmentsClient from './appointments-client';
import type { Appointment, User } from '@prisma/client';

interface AppointmentWithUser extends Appointment {
  patient?: { user: User | null } | null;
  doctor?: { user: User | null } | null;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const role = (session.user as { role?: string }).role ?? 'PATIENT';

  let appointments: AppointmentWithUser[] = [];
  if (role === 'DOCTOR') {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId: (session.user as { id?: string }).id! },
      select: { id: true },
    });
    if (doctor) {
      appointments = await prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: { patient: { include: { user: true } } },
        orderBy: { startsAtUTC: 'asc' },
      });
    }
  } else if (role === 'PATIENT') {
    const patient = await prisma.patientProfile.findUnique({
      where: { userId: (session.user as { id?: string }).id! },
      select: { id: true },
    });
    if (patient) {
      appointments = await prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: { doctor: { include: { user: true } } },
        orderBy: { startsAtUTC: 'asc' },
      });
    }
  } else if (role === 'ADMIN') {
    appointments = await prisma.appointment.findMany({
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
      orderBy: { startsAtUTC: 'asc' },
    });
  }

  const serialized = appointments.map((a) => ({
    id: a.id,
    startsAtUTC: a.startsAtUTC.toISOString(),
    endsAtUTC: a.endsAtUTC.toISOString(),
    status: a.status,
    patient: a.patient ? { user: { name: a.patient.user?.name ?? null } } : undefined,
    doctor: a.doctor ? { user: { name: a.doctor.user?.name ?? null } } : undefined,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="mb-2 text-2xl text-[var(--primary)]">Welcome, {session.user?.name}</h1>
        <p className="mb-4">Role: {role}</p>
        {serialized.length > 0 && (
          <div className="overflow-hidden rounded bg-white p-4 shadow">
            <AppointmentsClient role={role} initial={serialized} />
          </div>
        )}
      </div>
    </div>
  );
}
