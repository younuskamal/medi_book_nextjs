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

  return (
    <ul>
      {appointments.map((a) => (
        <li key={a.id} className="border p-2 mb-2">
          {role === 'DOCTOR' ? (
            <p>Patient: {a.patient?.user.name}</p>
          ) : (
            <p>Doctor: {a.doctor?.user.name}</p>
          )}
          <p>
            {new Date(a.startsAtUTC).toLocaleString()} -
            {` `}
            {new Date(a.endsAtUTC).toLocaleString()}
          </p>
          <p>Status: {a.status}</p>
          {role === 'DOCTOR' && (
            <div className="space-x-2 mt-2">
              {['CONFIRMED', 'CANCELLED', 'DONE'].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(a.id, s)}
                  className="px-2 py-1 border"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
