'use client';

import { useState } from 'react';

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

  const updateStatus = async (id: string, status: string) => {
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
      alert('Failed to update');
    }
  };

  const actions = (a: Appointment) => {
    if (role === 'DOCTOR' || role === 'ADMIN') {
      return (
        <div className="space-x-2">
          {['CONFIRMED', 'CANCELLED', 'DONE'].map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(a.id, s)}
              className={
                s === 'CANCELLED'
                  ? 'rounded bg-red-500 px-2 py-1 text-white'
                  : s === 'DONE'
                    ? 'rounded bg-green-600 px-2 py-1 text-white'
                    : 'rounded bg-[var(--primary)] px-2 py-1 text-white'
              }
            >
              {s}
            </button>
          ))}
        </div>
      );
    }
    if (role === 'PATIENT' && a.status === 'PENDING') {
      return (
        <button
          onClick={() => updateStatus(a.id, 'CANCELLED')}
          className="rounded bg-red-500 px-2 py-1 text-white"
        >
          Cancel
        </button>
      );
    }
    return null;
  };

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1 text-left">
            {role === 'DOCTOR' ? 'Patient' : 'Doctor'}
          </th>
          <th className="border px-2 py-1 text-left">Start</th>
          <th className="border px-2 py-1 text-left">End</th>
          <th className="border px-2 py-1 text-left">Status</th>
          <th className="border px-2 py-1 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a) => (
          <tr key={a.id} className="border-b last:border-b-0">
            <td className="border px-2 py-1">
              {role === 'DOCTOR' ? a.patient?.user.name : a.doctor?.user.name}
            </td>
            <td className="border px-2 py-1">
              {new Date(a.startsAtUTC).toLocaleString()}
            </td>
            <td className="border px-2 py-1">
              {new Date(a.endsAtUTC).toLocaleString()}
            </td>
            <td className="border px-2 py-1">{a.status}</td>
            <td className="border px-2 py-1">{actions(a)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
