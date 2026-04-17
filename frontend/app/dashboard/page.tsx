'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/lib/auth';
import { MY_ORDERS } from '@/lib/queries';
import Link from 'next/link';
import AppShell from '@/components/AppShell';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: ordersData } = useQuery(MY_ORDERS, { fetchPolicy: 'network-only' }) as any;

  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);
  if (!user) return null;

  const orders = ordersData?.myOrders || [];
  const pendingOrders = orders.filter((o: any) => o.status === 'PENDING');
  const placedOrders = orders.filter((o: any) => o.status === 'PLACED');
  const totalRevenue = placedOrders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
  const formatPrice = (p: number) => p < 100 ? `$${p.toFixed(2)}` : `₹${p.toFixed(0)}`;

  const statusBadge: Record<string, { bg: string; color: string; label: string }> = {
    PLACED:    { bg: 'rgba(16,185,129,0.1)', color: '#6ee7b7', label: 'Placed' },
    PENDING:   { bg: 'rgba(99,102,241,0.1)', color: '#a5b4fc', label: 'Pending' },
    CANCELLED: { bg: 'rgba(239,68,68,0.1)',  color: '#fca5a5', label: 'Cancelled' },
  };

  const regionLabel = user.country === 'ALL' ? 'Global Hub' : `${user.country} Hub`;
  const roleColor = user.role === 'ADMIN' ? '#fca5a5' : user.role === 'MANAGER' ? '#a5b4fc' : '#86efac';

  return (
    <AppShell>
      <main className="pt-4 sm:pt-6 px-4 sm:px-6 pb-6 max-w-7xl mx-auto space-y-5 sm:space-y-6">

        {/* ── Welcome ── */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2"
              style={{ background: 'rgba(164,65,0,0.25)', color: '#ffb695' }}>
              {regionLabel}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: '#dae2fd' }}>
              Welcome, {user.name.split(' ')[0]}
            </h1>
            <p className="mt-1 text-sm" style={{ color: '#94a3b8' }}>
              Here's what's happening with Slooze Eats today.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/restaurants"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background: '#1e2a45', color: '#dae2fd', border: '1px solid rgba(70,69,85,0.3)' }}>
              🍽️ Browse
            </Link>
            <Link href="/orders"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)', color: '#1d00a5', boxShadow: '0 4px 15px rgba(79,70,229,0.3)' }}>
              📋 My Orders
            </Link>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'Total Revenue', value: formatPrice(totalRevenue), sub: `${placedOrders.length} placed orders`, icon: '💰', color: '#34d399' },
            { label: 'Pending Orders', value: String(pendingOrders.length), sub: 'Awaiting checkout', icon: '🛵', color: '#818cf8' },
            { label: 'Total Orders', value: String(orders.length), sub: 'All time', icon: '📊', color: '#ffb695' },
          ].map(stat => (
            <div key={stat.label} className="p-5 rounded-2xl relative overflow-hidden group"
              style={{ background: '#131b2e', border: '1px solid rgba(70,69,85,0.15)' }}>
              <div className="absolute top-3 right-3 text-4xl opacity-10 group-hover:opacity-20 transition-opacity select-none">
                {stat.icon}
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: '#94a3b8' }}>{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#dae2fd' }}>{stat.value}</p>
              <p className="mt-2 text-xs font-semibold" style={{ color: stat.color }}>{stat.sub}</p>
            </div>
          ))}
        </section>

        {/* ── Main Grid ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Orders */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold" style={{ color: '#dae2fd' }}>Recent Orders</h2>
              <Link href="/orders" className="text-xs font-semibold hover:underline" style={{ color: '#c3c0ff' }}>View all →</Link>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: '#171f33', border: '1px solid rgba(70,69,85,0.15)' }}>
              {orders.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-3xl mb-3">🛒</p>
                  <p className="text-sm font-medium mb-1" style={{ color: '#dae2fd' }}>No orders yet</p>
                  <p className="text-xs mb-4" style={{ color: '#64748b' }}>Start by browsing restaurants</p>
                  <Link href="/restaurants"
                    className="inline-flex px-5 py-2 rounded-xl text-sm font-bold transition-all"
                    style={{ background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)', color: '#1d00a5' }}>
                    Browse Restaurants
                  </Link>
                </div>
              ) : (
                <div>
                  {/* Table header — hidden on mobile */}
                  <div className="hidden sm:grid grid-cols-12 px-4 py-3 text-xs font-bold uppercase tracking-widest border-b"
                    style={{ color: '#64748b', borderColor: 'rgba(70,69,85,0.2)' }}>
                    <div className="col-span-4">Order</div>
                    <div className="col-span-3">Items</div>
                    <div className="col-span-3">Amount</div>
                    <div className="col-span-2 text-right">Status</div>
                  </div>

                  <div className="divide-y" style={{ borderColor: 'rgba(70,69,85,0.1)' }}>
                    {orders.slice(0, 5).map((order: any) => {
                      const badge = statusBadge[order.status] || statusBadge.PENDING;
                      return (
                        <div key={order.id}
                          className="px-4 py-3.5 transition-colors cursor-pointer"
                          style={{ background: 'transparent' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#1e2a45')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          {/* Mobile layout */}
                          <div className="sm:hidden flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ background: '#1e2a45', color: '#a5b4fc', border: '1px solid rgba(70,69,85,0.3)' }}>
                                #{order.id}
                              </div>
                              <div>
                                <p className="text-sm font-semibold" style={{ color: '#dae2fd' }}>Order #{order.id}</p>
                                <p className="text-xs" style={{ color: '#64748b' }}>
                                  {order.items.length} items · {formatPrice(order.totalAmount)}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full font-semibold"
                              style={{ background: badge.bg, color: badge.color }}>
                              {badge.label}
                            </span>
                          </div>

                          {/* Desktop layout */}
                          <div className="hidden sm:grid grid-cols-12 items-center">
                            <div className="col-span-4 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ background: '#1e2a45', color: '#a5b4fc', border: '1px solid rgba(70,69,85,0.3)' }}>
                                #{order.id}
                              </div>
                              <div>
                                <p className="text-sm font-semibold" style={{ color: '#dae2fd' }}>Order #{order.id}</p>
                                <p className="text-xs" style={{ color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="col-span-3 text-sm" style={{ color: '#94a3b8' }}>
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </div>
                            <div className="col-span-3 text-sm font-semibold" style={{ color: '#dae2fd' }}>
                              {formatPrice(order.totalAmount)}
                            </div>
                            <div className="col-span-2 text-right">
                              <span className="text-xs px-2 py-1 rounded-full font-semibold"
                                style={{ background: badge.bg, color: badge.color }}>
                                {badge.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* User Card */}
            <div className="rounded-2xl p-5" style={{ background: '#131b2e', border: '1px solid rgba(70,69,85,0.15)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)', color: '#1d00a5' }}>
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate" style={{ color: '#dae2fd' }}>{user.name}</p>
                  <p className="text-xs truncate" style={{ color: '#64748b' }}>{user.email}</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Role', value: user.role, valueColor: roleColor },
                  { label: 'Region', value: user.country === 'ALL' ? 'Global' : user.country, valueColor: '#dae2fd' },
                  { label: 'Orders', value: String(orders.length), valueColor: '#dae2fd' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center text-sm">
                    <span style={{ color: '#64748b' }}>{row.label}</span>
                    <span className="font-semibold" style={{ color: row.valueColor }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl p-5" style={{ background: '#1e2a45', border: '1px solid rgba(70,69,85,0.15)' }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#dae2fd' }}>🚀 Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { href: '/restaurants', icon: '🍽️', label: 'Browse Restaurants' },
                  { href: '/orders', icon: '📋', label: 'View My Orders' },
                  ...(user.role === 'ADMIN' ? [{ href: '/payments', icon: '💳', label: 'Manage Payments' }] : []),
                ].map(action => (
                  <Link key={action.href} href={action.href}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: '#131b2e', color: '#c7c4d8' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#0f1829')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#131b2e')}
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                    <span className="ml-auto" style={{ color: '#64748b' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* RBAC Info */}
            <div className="rounded-2xl p-5" style={{ background: '#1e2a45', border: '1px solid rgba(70,69,85,0.15)' }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#dae2fd' }}>📋 Your Permissions</h3>
              <div className="space-y-2">
                {[
                  { label: 'View Restaurants', allowed: true },
                  { label: 'Create Orders', allowed: true },
                  { label: 'Checkout & Pay', allowed: user.role !== 'MEMBER' },
                  { label: 'Cancel Orders', allowed: user.role !== 'MEMBER' },
                  { label: 'Manage Payments', allowed: user.role === 'ADMIN' },
                ].map(perm => (
                  <div key={perm.label} className="flex justify-between items-center text-xs">
                    <span style={{ color: '#94a3b8' }}>{perm.label}</span>
                    <span className="font-bold" style={{ color: perm.allowed ? '#6ee7b7' : '#f87171' }}>
                      {perm.allowed ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
