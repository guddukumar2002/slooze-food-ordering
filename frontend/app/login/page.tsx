'use client';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { LOGIN } from '@/lib/queries';
import { useAuth } from '@/lib/auth';

const USERS = [
  { name: 'Nick Fury',       email: 'nick@slooze.com',    role: 'Admin',   country: null },
  { name: 'Captain Marvel',  email: 'marvel@slooze.com',  role: 'Manager', country: 'India' },
  { name: 'Captain America', email: 'america@slooze.com', role: 'Manager', country: 'America' },
  { name: 'Thanos',          email: 'thanos@slooze.com',  role: 'Member',  country: 'India' },
  { name: 'Thor',            email: 'thor@slooze.com',    role: 'Member',  country: 'India' },
  { name: 'Travis',          email: 'travis@slooze.com',  role: 'Member',  country: 'America' },
];

const roleStyle: Record<string, { bg: string; color: string }> = {
  Admin:   { bg: 'rgba(239,68,68,0.15)',  color: '#fca5a5' },
  Manager: { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc' },
  Member:  { bg: 'rgba(34,197,94,0.15)',  color: '#86efac' },
};

export default function LoginPage() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('password123');
  const [error, setError]               = useState('');
  const [showPwd, setShowPwd]           = useState(false);
  const [showDemo, setShowDemo]         = useState(false);
  const { login, user }                 = useAuth();
  const router                          = useRouter();
  const [doLogin, { loading }]          = useMutation(LOGIN);

  useEffect(() => { if (user) router.push('/dashboard'); }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await doLogin({ variables: { email, password } });
      const d   = (res.data as any).login;
      login(d.token, d.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message?.replace('ApolloError: ', '') || 'Invalid credentials');
    }
  };

  const pick = (u: typeof USERS[0]) => {
    setEmail(u.email);
    setPassword('password123');
    setShowDemo(false);
  };

  const S = {
    page: {
      backgroundColor: '#0b1326',
      minHeight: '100vh',
      width: '100%',
      fontFamily: 'Inter, sans-serif',
      color: '#dae2fd',
    } as React.CSSProperties,
    card: {
      background: 'rgba(23,31,51,0.95)',
      border: '1px solid rgba(70,69,85,0.25)',
      borderRadius: '1rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    } as React.CSSProperties,
    input: {
      width: '100%',
      background: '#060e20',
      border: '1px solid rgba(70,69,85,0.35)',
      borderRadius: '0.75rem',
      color: '#dae2fd',
      fontSize: '0.875rem',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      outline: 'none',
    } as React.CSSProperties,
    btn: {
      width: '100%',
      background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)',
      color: '#1d00a5',
      fontWeight: 700,
      fontSize: '0.875rem',
      padding: '0.875rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(79,70,229,0.35)',
    } as React.CSSProperties,
  };

  return (
    <div style={S.page}>
      {/* inner wrapper — scrollable, centered */}
      <div style={{
        maxWidth: '1024px',
        margin: '0 auto',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}>

        {/* ── Branding ── */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '1rem', margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)',
            boxShadow: '0 0 40px rgba(79,70,229,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
          }}>🍔</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>Slooze Eats</h1>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>Culinary Management Suite</p>
        </div>

        {/* ── Two-column on large screens, single on mobile ── */}
        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: '1.25rem',
          alignItems: 'start',
        }}>

          {/* ── Login Form ── */}
          <div style={S.card}>
            <div style={{ padding: '1.75rem' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }}>
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="name@slooze.com" required autoComplete="email"
                      style={S.input}
                      onFocus={e => (e.currentTarget.style.border = '1px solid rgba(195,192,255,0.5)')}
                      onBlur={e  => (e.currentTarget.style.border = '1px solid rgba(70,69,85,0.35)')}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }}>
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      type={showPwd ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                      placeholder="••••••••"
                      style={{ ...S.input, paddingRight: '3rem' }}
                      onFocus={e => (e.currentTarget.style.border = '1px solid rgba(195,192,255,0.5)')}
                      onBlur={e  => (e.currentTarget.style.border = '1px solid rgba(70,69,85,0.35)')}
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1rem', padding: 0 }}>
                      {showPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⚠️ {error}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}>
                  {loading ? 'Signing in…' : 'Continue to Dashboard →'}
                </button>
              </form>

              {/* Demo users toggle (mobile / always visible) */}
              <div style={{ marginTop: '1rem' }}>
                <button onClick={() => setShowDemo(!showDemo)}
                  style={{ width: '100%', background: '#131b2e', border: '1px solid rgba(70,69,85,0.3)', borderRadius: '0.75rem', color: '#c3c0ff', fontSize: '0.8rem', fontWeight: 600, padding: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  ⚡ {showDemo ? 'Hide' : 'Show'} Demo Users
                </button>

                {showDemo && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflow: 'hidden' }}>
                    {USERS.map(u => (
                      <button key={u.email} onClick={() => pick(u)}
                        style={{
                          background: email === u.email ? 'rgba(79,70,229,0.15)' : '#060e20',
                          border: email === u.email ? '1px solid rgba(195,192,255,0.3)' : '1px solid rgba(70,69,85,0.2)',
                          borderRadius: '0.75rem', padding: '0.625rem 0.75rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
                          width: '100%', textAlign: 'left', overflow: 'hidden', boxSizing: 'border-box',
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(195,192,255,0.1)', color: '#c3c0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                            {u.name.charAt(0)}
                          </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#dae2fd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>{u.name}</p>
                            <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>{u.email}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontWeight: 600, background: roleStyle[u.role].bg, color: roleStyle[u.role].color }}>
                            {u.role}
                          </span>
                          {u.country && (
                            <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: 'rgba(70,69,85,0.4)', color: '#94a3b8' }}>
                              {u.country}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b', marginTop: '1rem' }}>
                Default password:{' '}
                <code style={{ background: '#131b2e', color: '#c3c0ff', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>password123</code>
              </p>
            </div>
          </div>

          {/* ── Access Matrix (always visible) ── */}
          <div style={{ ...S.card, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(70,69,85,0.2)' }}>
              <h2 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#dae2fd' }}>📋 Access Matrix</h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>Role-based permissions</p>
            </div>
            <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { label: 'View Restaurants & Menu', admin: true,  manager: true,  member: true  },
                { label: 'Create Order & Add Items', admin: true,  manager: true,  member: true  },
                { label: 'Checkout & Pay',           admin: true,  manager: true,  member: false },
                { label: 'Cancel Order',             admin: true,  manager: true,  member: false },
                { label: 'Manage Payments',          admin: true,  manager: false, member: false },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', flex: 1, minWidth: 0 }}>{row.label}</span>
                  <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                    {[
                      { label: 'A', allowed: row.admin,   color: '#fca5a5' },
                      { label: 'M', allowed: row.manager, color: '#a5b4fc' },
                      { label: 'Me', allowed: row.member, color: '#86efac' },
                    ].map(r => (
                      <span key={r.label} style={{
                        fontSize: '0.6rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '0.25rem',
                        background: r.allowed ? `${r.color}22` : 'rgba(70,69,85,0.2)',
                        color: r.allowed ? r.color : '#475569',
                        border: `1px solid ${r.allowed ? `${r.color}44` : 'rgba(70,69,85,0.2)'}`,
                      }}>
                        {r.label} {r.allowed ? '✓' : '✗'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Region info */}
            <div style={{ margin: '0 1rem 1rem', padding: '0.875rem 1rem', background: '#060e20', borderRadius: '0.75rem', border: '1px solid rgba(70,69,85,0.2)' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>ReBAC — Region Filter</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {[
                  { user: 'Nick Fury (Admin)', sees: 'All restaurants' },
                  { user: 'India users', sees: 'India restaurants only' },
                  { user: 'America users', sees: 'America restaurants only' },
                ].map(r => (
                  <div key={r.user} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', gap: '0.5rem' }}>
                    <span style={{ color: '#94a3b8' }}>{r.user}</span>
                    <span style={{ color: '#c3c0ff', fontWeight: 500, textAlign: 'right' }}>{r.sees}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
