'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    router.push('/login');
  };

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    router.push(href);
  };

  const navItems = [
    { href: '/dashboard',   label: 'Dashboard',   icon: '🏠' },
    { href: '/restaurants', label: 'Restaurants', icon: '🍽️' },
    { href: '/orders',      label: 'Orders',      icon: '📋' },
    ...(user?.role === 'ADMIN' ? [{ href: '/payments', label: 'Payments', icon: '💳' }] : []),
  ];

  const roleStyle =
    user?.role === 'ADMIN'   ? { color: '#fca5a5', dot: '#ef4444' } :
    user?.role === 'MANAGER' ? { color: '#a5b4fc', dot: '#6366f1' } :
                               { color: '#86efac', dot: '#22c55e' };

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? '';
  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <div style={{ backgroundColor: '#0b1326', color: '#dae2fd', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>

      {/* ── HEADER ── */}
      <header className="fixed top-0 w-full z-50 h-16"
        style={{ background: 'rgba(11,19,38,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="h-full flex items-center justify-between px-4 lg:px-6">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0 no-underline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)' }}>
              🍔
            </div>
            <span className="text-base font-bold" style={{ color: '#f1f5f9' }}>Slooze Eats</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline"
                  style={{
                    background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: active ? '#c3c0ff' : '#64748b',
                    borderBottom: active ? '2px solid #6366f1' : '2px solid transparent',
                  }}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* User pill desktop */}
            <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)', color: '#fff' }}>
                {initials}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{firstName}</span>
                <span className="text-[10px] font-bold mt-0.5" style={{ color: roleStyle.color }}>{user?.role}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: roleStyle.dot }} />
            </div>

            {/* Logout desktop */}
            <button onClick={handleLogout}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>

            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg"
              style={{
                background: menuOpen ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ top: '64px' }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full"
            style={{ background: '#0d1628', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-4 space-y-1">

              {/* User info */}
              <div className="flex items-center gap-3 p-3 rounded-xl mb-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)', color: '#fff' }}>
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{user?.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: roleStyle.dot }} />
                    <span className="text-xs" style={{ color: roleStyle.color }}>{user?.role}</span>
                    {user?.country !== 'ALL' && (
                      <span className="text-xs" style={{ color: '#475569' }}>· {user?.country}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Nav items — use button + router.push for reliable mobile navigation */}
              {navItems.map(item => {
                const active = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-left"
                    style={{
                      background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                      color: active ? '#c3c0ff' : '#94a3b8',
                      border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                      cursor: 'pointer',
                    }}>
                    <span className="text-lg w-6 text-center flex-shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#6366f1' }} />}
                  </button>
                );
              })}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium mt-2"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="pt-16 pb-20 lg:pb-6">
        {children}
      </div>

      {/* ── BOTTOM NAV mobile ── */}
      <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden"
        style={{ background: 'rgba(11,19,38,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl flex-1 min-w-0"
                style={{ color: active ? '#818cf8' : '#475569', cursor: 'pointer' }}>
                <span className="text-xl leading-none">{item.icon}</span>
                <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
                {active && <div className="w-3 h-0.5 rounded-full" style={{ background: '#6366f1' }} />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
