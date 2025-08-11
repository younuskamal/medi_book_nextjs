'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/lib/language';
import { t, type Key } from '@/lib/i18n';

interface FormData {
  doctorId: string;
  start: string;
  end: string;
}

export default function AppointmentsPage() {
  const { register, handleSubmit } = useForm<FormData>();
  const [message, setMessage] = useState<{ key: Key; error: boolean } | null>(null);
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);
  const { lang } = useLanguage();

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
      setMessage({ key: 'appointmentBooked', error: false });
    } else {
      setMessage({ key: 'error', error: true });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 text-[var(--foreground)]">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-4 text-xl text-[var(--primary)]">{t(lang, 'bookAppointment')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded bg-white p-4 shadow">
          <div>
            <label className="mb-1 block">{t(lang, 'doctor')}</label>
            <select
              {...register('doctorId')}
              className="block w-full rounded border px-2 py-1"
              defaultValue=""
            >
              <option value="" disabled>
                {t(lang, 'selectDoctor')}
              </option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block">{t(lang, 'start')}</label>
            <input type="datetime-local" {...register('start')} className="block w-full rounded border px-2 py-1" />
          </div>
          <div>
            <label className="mb-1 block">{t(lang, 'end')}</label>
            <input type="datetime-local" {...register('end')} className="block w-full rounded border px-2 py-1" />
          </div>
          <button
            type="submit"
            className="rounded bg-[var(--primary)] px-4 py-2 text-white hover:opacity-90"
          >
            {t(lang, 'bookVerb')}
          </button>
        </form>
        {message && (
          <p className={`mt-4 ${message.error ? 'text-red-600' : 'text-green-600'}`}>
            {t(lang, message.key)}
          </p>
        )}
      </div>
    </div>
  );
}
