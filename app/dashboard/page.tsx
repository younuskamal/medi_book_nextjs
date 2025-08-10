import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const role = (session.user as { role?: string }).role;

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Welcome, {session.user?.name}</h1>
      <p>Role: {role}</p>
    </div>
  );
}
