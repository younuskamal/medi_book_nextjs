'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { t, type Key } from '@/lib/i18n';

interface Appointment {
  id: string;
  startsAtUTC: string;
  endsAtUTC: string;
  status: string;
  patient?: { user: { name: string | null } };
  doctor?: { user: { name: string | null } };
}

export default function AppointmentsClient({
  role,
  initial,
}: {
  role: string;
  initial: Appointment[];
}) {
  const [appointments, setAppointments] = useState(initial);
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  const updateStatus = async (id: string, status: string) => {
    setLoading(true);
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } else {
      alert(t(lang, 'updateFailed'));
    }
    setLoading(false);
  };

  const actions = (a: Appointment) => {
    if (role === 'DOCTOR' || role === 'ADMIN') {
      return (
        <div className="space-x-2">
          {['CONFIRMED', 'CANCELLED', 'DONE'].map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(a.id, s)}
              disabled={loading}
              className={
                (s === 'CANCELLED'
                  ? 'bg-red-500'
                  : s === 'DONE'
                    ? 'bg-green-600'
                    : 'bg-[var(--primary)]') +
                ' rounded px-2 py-1 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
              }
            >
              {t(lang, s.toLowerCase() as Key)}
            </button>
          ))}
        </div>
      );
    }
    if (role === 'PATIENT' && a.status === 'PENDING') {
      return (
        <button
          onClick={() => updateStatus(a.id, 'CANCELLED')}
          disabled={loading}
          className="rounded bg-red-500 px-2 py-1 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t(lang, 'cancel')}
        </button>
      );
    }
    return null;
  };

  if (appointments.length === 0) {
    return <p className="text-center">{t(lang, 'noAppointments')}</p>;
  }

  return (
    <table className="w-full border-collapse text-sm md:text-base">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-2 py-1 text-left">
            {role === 'DOCTOR' ? t(lang, 'patient') : t(lang, 'doctor')}
          </th>
          <th className="border px-2 py-1 text-left">{t(lang, 'start')}</th>
          <th className="border px-2 py-1 text-left">{t(lang, 'end')}</th>
          <th className="border px-2 py-1 text-left">{t(lang, 'status')}</th>
          <th className="border px-2 py-1 text-left">{t(lang, 'actions')}</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a) => (
          <tr key={a.id} className="border-b odd:bg-gray-50 last:border-b-0">
            <td className="border px-2 py-1">
              {role === 'DOCTOR' ? a.patient?.user.name : a.doctor?.user.name}
            </td>
            <td className="border px-2 py-1">
              {new Date(a.startsAtUTC).toLocaleString()}
            </td>
            <td className="border px-2 py-1">
              {new Date(a.endsAtUTC).toLocaleString()}
            </td>
            <td className="border px-2 py-1">
              <span
                className={`rounded px-2 py-1 text-white ${
                  a.status === 'CANCELLED'
                    ? 'bg-red-500'
                    : a.status === 'DONE'
                      ? 'bg-gray-600'
                      : a.status === 'CONFIRMED'
                        ? 'bg-green-600'
                        : 'bg-yellow-500'
                }`}
              >
                {t(lang, a.status.toLowerCase() as Key)}
              </span>
            </td>
            <td className="border px-2 py-1">{actions(a)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
