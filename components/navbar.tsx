'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="flex items-center justify-between bg-gray-100 px-4 py-2">
      <Link href="/" className="font-semibold">MediBook</Link>
      <div className="space-x-4">
        {session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/appointments">Book</Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-red-600"
            >
              Sign out
            </button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
