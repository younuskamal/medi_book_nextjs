'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/i18n';

export default function Navbar() {
  const { data: session } = useSession();
  const { lang, setLang } = useLanguage();
  const toggle = () => setLang(lang === 'en' ? 'ar' : 'en');
  return (
    <nav className="flex items-center justify-between bg-[var(--primary)] px-4 py-2 text-white">
      <Link href="/" className="font-semibold">
        MediBook
      </Link>
      <div className="flex items-center space-x-4">
        <button onClick={toggle} className="rounded bg-gray-700 px-2 py-1">
          {t(lang, 'lang')}
        </button>
        {session ? (
          <>
            <Link href="/dashboard" className="hover:underline">
              {t(lang, 'dashboard')}
            </Link>
            <Link href="/appointments" className="hover:underline">
              {t(lang, 'book')}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="rounded bg-red-600 px-2 py-1 text-white"
            >
              {t(lang, 'logout')}
            </button>
          </>
        ) : (
          <Link href="/login" className="hover:underline">
            {t(lang, 'login')}
          </Link>
        )}
      </div>
    </nav>
  );
}
