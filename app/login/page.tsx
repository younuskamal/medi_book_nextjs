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
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded bg-white">
          <div>
            <label className="block">Email</label>
            <input type="email" {...register('email')} className="border px-2 py-1 w-full" />
          </div>
          <div>
            <label className="block">Password</label>
            <input type="password" {...register('password')} className="border px-2 py-1 w-full" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">Login</button>
        </form>
        <div className="border rounded p-4 bg-white">
          <p className="mb-2 font-medium">Demo accounts</p>
          <div className="space-x-2">
            {Object.keys(demos).map((role) => (
              <button
                key={role}
                onClick={() => fill(role as keyof typeof demos)}
                className="bg-gray-200 px-2 py-1 rounded"
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
