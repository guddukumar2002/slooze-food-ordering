'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push('/login'); };

  const roleColor = user?.role === 'ADMIN' ? 'bg-red-500' : user?.role === 'MANAGER' ? 'bg-blue-500' : 'bg-green-500';

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🍔</span>
        <span className="text-xl font-bold text-orange-400">Slooze Eats</span>
      </div>
      {user && (
        <div className="flex items-center gap-6">
          <Link href="/restaurants" className="hover:text-orange-400 transition">Restaurants</Link>
          <Link href="/orders" className="hover:text-orange-400 transition">My Orders</Link>
          {user.role === 'ADMIN' && (
            <Link href="/payments" className="hover:text-orange-400 transition">Payments</Link>
          )}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{user.name}</p>
              <div className="flex items-center gap-1">
                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${roleColor}`}>{user.role}</span>
                {user.country !== 'ALL' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-600">{user.country}</span>
                )}
              </div>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm transition">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
