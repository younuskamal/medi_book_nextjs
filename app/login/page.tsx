'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>();
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

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded">
        <div>
          <label className="block">Email</label>
          <input type="email" {...register('email')} className="border px-2 py-1" />
        </div>
        <div>
          <label className="block">Password</label>
          <input type="password" {...register('password')} className="border px-2 py-1" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
      </form>
    </div>
  );
}
