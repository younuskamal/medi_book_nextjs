'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const res = await signIn('credentials', {
      ...data,
      redirect: false,
    });
    if (res && !res.error) {
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const demos = {
    Admin: { email: 'admin@demo.io', password: 'Admin123!' },
    Doctor: { email: 'dr.house@demo.io', password: 'Doctor123!' },
    Patient: { email: 'patient@demo.io', password: 'Patient123!' },
  } as const;

  const fill = (role: keyof typeof demos) => {
    const { email, password } = demos[role];
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="space-y-6 w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded bg-white p-6 shadow">
          <div>
            <label className="block">Email</label>
            <input type="email" {...register('email')} className="border px-2 py-1 w-full" />
          </div>
          <div>
            <label className="block">Password</label>
            <input type="password" {...register('password')} className="border px-2 py-1 w-full" />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-[var(--primary)] px-4 py-2 text-white hover:opacity-90"
          >
            Login
          </button>
        </form>
        <div className="rounded bg-white p-4 shadow">
          <p className="mb-2 font-medium">Demo accounts</p>
          <div className="space-x-2">
            {Object.keys(demos).map((role) => (
              <button
                key={role}
                onClick={() => fill(role as keyof typeof demos)}
                className="rounded bg-gray-200 px-2 py-1"
              >
                {role}
              </button>
            ))}
          </div>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="pr-2">Role</th>
                <th className="pr-2">Email</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(demos).map(([role, creds]) => (
                <tr key={role}>
                  <td className="pr-2">{role}</td>
                  <td className="pr-2">{creds.email}</td>
                  <td>{creds.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
