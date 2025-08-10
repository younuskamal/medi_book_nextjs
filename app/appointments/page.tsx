'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  doctorId: string;
  start: string;
  end: string;
}

export default function AppointmentsPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const [message, setMessage] = useState('');
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  }, []);

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId: data.doctorId,
        startsAtUTC: new Date(data.start).toISOString(),
        endsAtUTC: new Date(data.end).toISOString(),
      }),
    });
    if (res.ok) {
      setMessage('Appointment booked');
    } else {
      const err = await res.json();
      setMessage(err.error || 'Error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-4 text-xl text-[var(--primary)]">Book Appointment</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded bg-white p-4 shadow">
          <div>
            <label>Doctor</label>
            <select
              {...register('doctorId')}
            className="block w-full border px-2 py-1"
            defaultValue=""
          >
            <option value="" disabled>
              Select a doctor
            </option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Start</label>
          <input type="datetime-local" {...register('start')} className="border px-2 py-1 block" />
        </div>
        <div>
          <label>End</label>
          <input type="datetime-local" {...register('end')} className="border px-2 py-1 block" />
        </div>
        <button
          type="submit"
          className="rounded bg-[var(--primary)] px-4 py-2 text-white hover:opacity-90"
        >
          Book
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
}
