'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); router.push('/login'); };

  const navItems = [
    { href: '/dashboard',    label: 'Dashboard',    icon: '🏠' },
    { href: '/restaurants',  label: 'Restaurants',  icon: '🍽️' },
    { href: '/orders',       label: 'Orders',       icon: '📋' },
    ...(user?.role === 'ADMIN' ? [{ href: '/payments', label: 'Payments', icon: '💳' }] : []),
  ];

  const roleStyle =
    user?.role === 'ADMIN'
      ? { bg: 'rgba(239,68,68,0.15)',  color: '#fca5a5', dot: '#ef4444' }
      : user?.role === 'MANAGER'
      ? { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc', dot: '#6366f1' }
      : { bg: 'rgba(34,197,94,0.15)',  color: '#86efac', dot: '#22c55e' };

  const firstName = user?.name?.split(' ')[0] ?? '';
  const initials  = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? '';

  return (
    <div style={{ backgroundColor: '#0b1326', color: '#dae2fd', fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>

      {/* ── HEADER ── */}
      <header className="fixed top-0 w-full z-50 h-16 flex items-center"
        style={{ background: 'rgba(11,19,38,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-full flex items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}>
              🍔
            </div>
            <span className="text-base font-bold tracking-tight hidden sm:block" style={{ color: '#f1f5f9' }}>
              Slooze Eats
            </span>
          </Link>

          {/* Desktop Nav — centered */}
          <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {navItems.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all no-underline"
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

          {/* Right: user pill + logout */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* User pill — desktop */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)', color: '#fff' }}>
                {initials}
              </div>
              {/* Name + role */}
              <div className="flex flex-col leading-none">
                <span className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{firstName}</span>
                <span className="text-[10px] font-bold mt-0.5" style={{ color: roleStyle.color }}>{user?.role}</span>
              </div>
              {/* Online dot */}
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: roleStyle.dot, boxShadow: `0 0 6px ${roleStyle.dot}` }} />
            </div>

            {/* Logout */}
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Hamburger — mobile */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all"
              style={{ background: menuOpen ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}>
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

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="fixed top-16 left-0 w-full z-40 md:hidden"
          style={{ background: 'rgba(11,19,38,0.98)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="p-3 space-y-1">
            {/* User card */}
            <div className="flex items-center gap-3 p-3 rounded-xl mb-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)', color: '#fff' }}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: '#f1f5f9' }}>{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: roleStyle.dot }} />
                  <span className="text-xs font-medium" style={{ color: roleStyle.color }}>{user?.role}</span>
                  {user?.country !== 'ALL' && (
                    <span className="text-xs" style={{ color: '#475569' }}>· {user?.country}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Nav links */}
            {navItems.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline"
                  style={{
                    background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: active ? '#c3c0ff' : '#94a3b8',
                  }}>
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#6366f1' }} />}
                </Link>
              );
            })}

            {/* Logout in mobile menu */}
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mt-1"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.12)' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="pt-16 pb-20">
        {children}
      </div>

      {/* ── BOTTOM NAV (mobile only) ── */}
      <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden"
        style={{ background: 'rgba(11,19,38,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all active:scale-95 no-underline min-w-0"
                style={{ color: active ? '#818cf8' : '#475569' }}>
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
                {active && <div className="w-3 h-0.5 rounded-full" style={{ background: '#6366f1' }} />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
