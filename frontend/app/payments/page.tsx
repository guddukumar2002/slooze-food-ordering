'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { MY_PAYMENT_METHODS, ADD_PAYMENT_METHOD, UPDATE_PAYMENT_METHOD, DELETE_PAYMENT_METHOD } from '@/lib/queries';
import AppShell from '@/components/AppShell';

export default function PaymentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, refetch } = useQuery(MY_PAYMENT_METHODS, { fetchPolicy: 'network-only' }) as any;
  const [addPM] = useMutation(ADD_PAYMENT_METHOD) as any;
  const [updatePM] = useMutation(UPDATE_PAYMENT_METHOD) as any;
  const [deletePM] = useMutation(DELETE_PAYMENT_METHOD) as any;
  const [form, setForm] = useState({ type: 'CREDIT_CARD', last4: '', holderName: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);
  if (!user) return null;

  if (user.role !== 'ADMIN') {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
          <p className="text-5xl">🔒</p>
          <p className="text-xl font-bold" style={{ color: '#ffb4ab' }}>Access Denied</p>
          <p className="text-center" style={{ color: '#918fa1' }}>Only Admins can manage payment methods.</p>
        </div>
      </AppShell>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updatePM({ variables: { id: editId, ...form } });
        setMsg('✅ Updated.'); setEditId(null);
      } else {
        await addPM({ variables: form });
        setMsg('✅ Added.');
      }
      setForm({ type: 'CREDIT_CARD', last4: '', holderName: '' });
      refetch();
    } catch (e: any) { setMsg(`❌ ${e.message}`); }
  };

  const handleEdit = (pm: any) => {
    setEditId(pm.id);
    setForm({ type: pm.type, last4: pm.last4, holderName: pm.holderName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this payment method?')) return;
    try { await deletePM({ variables: { id } }); setMsg('✅ Deleted.'); refetch(); }
    catch (e: any) { setMsg(`❌ ${e.message}`); }
  };

  const cardIcon = (t: string) => t === 'CREDIT_CARD' ? '💳' : t === 'DEBIT_CARD' ? '🏦' : '📱';
  const pms = data?.myPaymentMethods || [];

  return (
    <AppShell>
      <main className="pt-4 sm:pt-6 px-4 sm:px-6 pb-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#dae2fd' }}>
              Payment Methods
            </h1>
            <p className="text-xs mt-1 font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
              Admin Only
            </p>
          </div>
          <span className="text-2xl">💳</span>
        </div>

        {/* Message */}
        {msg && (
          <div className="mb-5 p-3.5 rounded-xl text-sm"
            style={{
              background: msg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: msg.startsWith('✅') ? '#6ee7b7' : '#fca5a5',
              border: `1px solid ${msg.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

          {/* ── LEFT: Cards + Form ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Add/Edit Form */}
            <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#131b2e', border: '1px solid rgba(70,69,85,0.2)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl" style={{ background: 'rgba(79,70,229,0.2)' }}>
                  <span className="text-base">💳</span>
                </div>
                <h3 className="font-bold" style={{ color: '#dae2fd' }}>
                  {editId ? 'Edit Payment Method' : 'Add New Payment Method'}
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Form fields — stack on mobile, row on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: '#060e20', color: '#dae2fd', border: '1px solid rgba(70,69,85,0.3)' }}>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="UPI">UPI</option>
                  </select>
                  <input placeholder="Last 4 digits" value={form.last4} maxLength={4}
                    onChange={e => setForm({ ...form, last4: e.target.value })}
                    className="rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: '#060e20', color: '#dae2fd', border: '1px solid rgba(70,69,85,0.3)' }}
                    required />
                  <input placeholder="Card holder name" value={form.holderName}
                    onChange={e => setForm({ ...form, holderName: e.target.value })}
                    className="rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: '#060e20', color: '#dae2fd', border: '1px solid rgba(70,69,85,0.3)' }}
                    required />
                </div>
                <div className="flex gap-3">
                  <button type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)', color: '#1d00a5' }}>
                    {editId ? 'Update' : 'Add Method'}
                  </button>
                  {editId && (
                    <button type="button"
                      onClick={() => { setEditId(null); setForm({ type: 'CREDIT_CARD', last4: '', holderName: '' }); }}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: '#2d3449', color: '#c7c4d8' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Cards */}
            {pms.length === 0 ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: '#131b2e', border: '1px solid rgba(70,69,85,0.15)' }}>
                <p className="text-3xl mb-2">💳</p>
                <p className="text-sm" style={{ color: '#64748b' }}>No payment methods yet. Add one above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pms.map((pm: any) => (
                  <div key={pm.id}
                    className="relative overflow-hidden rounded-2xl p-5"
                    style={{
                      background: 'linear-gradient(135deg, #2d3449, #222a3d)',
                      border: editId === pm.id ? '1px solid rgba(195,192,255,0.4)' : '1px solid rgba(70,69,85,0.2)',
                    }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#64748b' }}>
                          {pm.type.replace(/_/g, ' ')}
                        </p>
                        <p className="font-semibold truncate" style={{ color: '#dae2fd' }}>{pm.holderName}</p>
                        <p className="text-sm font-mono mt-2 tracking-widest" style={{ color: '#94a3b8' }}>
                          •••• •••• •••• {pm.last4}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-2xl">{cardIcon(pm.type)}</span>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(pm)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(pm.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ background: 'rgba(147,0,10,0.2)', color: '#ffb4ab', border: '1px solid rgba(147,0,10,0.3)' }}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                      style={{ background: 'rgba(195,192,255,0.05)' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Summary ── */}
          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={{ background: '#131b2e', border: '1px solid rgba(70,69,85,0.15)' }}>
              <h3 className="font-bold mb-4" style={{ color: '#dae2fd' }}>Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Methods', value: pms.length },
                  { label: 'Credit Cards', value: pms.filter((p: any) => p.type === 'CREDIT_CARD').length },
                  { label: 'Debit Cards', value: pms.filter((p: any) => p.type === 'DEBIT_CARD').length },
                  { label: 'UPI', value: pms.filter((p: any) => p.type === 'UPI').length },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center text-sm">
                    <span style={{ color: '#64748b' }}>{row.label}</span>
                    <span className="font-bold" style={{ color: '#dae2fd' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">🔒</span>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: '#a5b4fc' }}>Secure & Encrypted</h4>
                  <p className="text-xs mt-1" style={{ color: 'rgba(165,180,252,0.7)' }}>
                    All payment data is encrypted and stored securely.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'rgba(164,65,0,0.1)', border: '1px solid rgba(164,65,0,0.2)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span>⭐</span>
                <span className="font-bold text-sm" style={{ color: '#ffb695' }}>Admin Privileges</span>
              </div>
              <p className="text-xs" style={{ color: '#ffd2be' }}>
                You have full access to manage all payment methods.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
