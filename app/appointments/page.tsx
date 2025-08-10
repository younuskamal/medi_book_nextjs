'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  doctorId: string;
  start: string;
  end: string;
}

export default function AppointmentsPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const [message, setMessage] = useState('');

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId: data.doctorId,
        startsAtUTC: data.start,
        endsAtUTC: data.end,
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
    <div className="p-4">
      <h1 className="mb-4 text-xl">Book Appointment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Doctor ID</label>
          <input {...register('doctorId')} className="border px-2 py-1 block" />
        </div>
        <div>
          <label>Start (UTC)</label>
          <input type="datetime-local" {...register('start')} className="border px-2 py-1 block" />
        </div>
        <div>
          <label>End (UTC)</label>
          <input type="datetime-local" {...register('end')} className="border px-2 py-1 block" />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Book</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
