'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="flex items-center justify-between bg-[var(--primary)] px-4 py-2 text-white">
      <Link href="/" className="font-semibold">
        MediBook
      </Link>
      <div className="space-x-4">
        {session ? (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/appointments" className="hover:underline">
              Book
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="rounded bg-red-600 px-2 py-1 text-white"
            >
              Sign out
            </button>
          </>
        ) : (
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
