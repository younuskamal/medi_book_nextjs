import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('Admin123!', 10);
  const doctorPass = await bcrypt.hash('Doctor123!', 10);
  const patientPass = await bcrypt.hash('Patient123!', 10);

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@demo.io' },
    update: {},
    create: {
      email: 'admin@demo.io',
      name: 'Admin',
      role: Role.ADMIN,
      passwordHash: adminPass,
    },
  });

  // Doctor + profile
  const doctorUser = await prisma.user.upsert({
    where: { email: 'dr.house@demo.io' },
    update: {},
    create: {
      email: 'dr.house@demo.io',
      name: 'Dr. House',
      role: Role.DOCTOR,
      passwordHash: doctorPass,
    },
  });

  const doctorProfile = await prisma.doctorProfile.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      specialty: 'Internal Medicine',
      clinicRoom: 'A-101',
    },
  });

  // Availability: Mon–Fri 09:00-17:00
  for (const weekday of [1, 2, 3, 4, 5]) {
    await prisma.availability.upsert({
      where: {
        doctorId_weekday_startTime_endTime: {
          doctorId: doctorProfile.id,
          weekday,
          startTime: '09:00',
          endTime: '17:00',
        },
      },
      update: {},
      create: {
        doctorId: doctorProfile.id,
        weekday,
        startTime: '09:00',
        endTime: '17:00',
      },
    });
  }

  // Patient + profile
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@demo.io' },
    update: {},
    create: {
      email: 'patient@demo.io',
      name: 'Demo Patient',
      role: Role.PATIENT,
      passwordHash: patientPass,
    },
  });

  await prisma.patientProfile.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      phone: '+905555555555',
    },
  });

  console.log('✅ Seed done (admin/doctor/patient created)');
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
