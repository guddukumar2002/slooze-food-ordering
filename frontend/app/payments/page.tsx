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
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-5xl">🔒</p>
          <p className="text-xl font-bold" style={{ color: '#ffb4ab' }}>Access Denied</p>
          <p style={{ color: '#918fa1' }}>Only Admins can manage payment methods.</p>
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

  const handleEdit = (pm: any) => { setEditId(pm.id); setForm({ type: pm.type, last4: pm.last4, holderName: pm.holderName }); };
  const handleDelete = async (id: number) => {
    if (!confirm('Delete?')) return;
    try { await deletePM({ variables: { id } }); setMsg('✅ Deleted.'); refetch(); }
    catch (e: any) { setMsg(`❌ ${e.message}`); }
  };

  const cardIcon = (t: string) => t === 'CREDIT_CARD' ? '💳' : t === 'DEBIT_CARD' ? '🏦' : '📱';

  const pms = data?.myPaymentMethods || [];

  return (
    <AppShell>
      <main className="pt-8 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Form + Cards */}
        <div className="md:col-span-8 space-y-8">
          <section>
            <div className="flex items-baseline justify-between mb-6">
              <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: '#dae2fd' }}>Payment Methods</h1>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#918fa1' }}>Admin Only</span>
            </div>

            {msg && (
              <div className="mb-6 p-4 rounded-xl text-sm"
                style={{ background: msg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msg.startsWith('✅') ? '#6ee7b7' : '#fca5a5', border: `1px solid ${msg.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                {msg}
              </div>
            )}

            {/* Existing cards */}
            <div className="space-y-4 mb-8">
              {pms.map((pm: any) => (
                <div key={pm.id}
                  className="relative overflow-hidden rounded-2xl p-6"
                  style={{ background: 'linear-gradient(135deg, #2d3449, #222a3d)', border: editId === pm.id ? '1px solid rgba(195,192,255,0.4)' : '1px solid rgba(70,69,85,0.2)', boxShadow: editId === pm.id ? '0 0 20px rgba(195,192,255,0.1)' : 'none' }}
                >
                  {editId === pm.id && (
                    <div className="absolute top-4 right-4">
                      <span className="text-lg">✏️</span>
                    </div>
                  )}
                  <div className="flex flex-col h-36 justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#918fa1' }}>{pm.type.replace('_', ' ')}</p>
                        <p className="text-lg font-medium" style={{ color: '#dae2fd' }}>{pm.holderName}</p>
                      </div>
                      <span className="text-3xl">{cardIcon(pm.type)}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-xl font-mono tracking-[0.2em]" style={{ color: '#dae2fd' }}>•••• •••• •••• {pm.last4}</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(pm)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(pm.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          style={{ background: 'rgba(147,0,10,0.2)', color: '#ffb4ab', border: '1px solid rgba(147,0,10,0.3)' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-3xl" style={{ background: 'rgba(195,192,255,0.05)' }} />
                </div>
              ))}
            </div>

            {/* Add/Edit form */}
            <div className="rounded-2xl p-6" style={{ background: '#131b2e', border: '1px solid rgba(70,69,85,0.2)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl" style={{ background: 'rgba(79,70,229,0.2)' }}>
                  <span className="text-lg">💳</span>
                </div>
                <h3 className="font-bold text-lg" style={{ color: '#dae2fd' }}>{editId ? 'Edit Payment Method' : 'Add New Payment Method'}</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full rounded-xl px-4 py-3.5 text-sm outline-none appearance-none"
                      style={{ background: '#060e20', color: '#dae2fd', border: '1px solid rgba(70,69,85,0.3)' }}>
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="DEBIT_CARD">Debit Card</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                  <input placeholder="Last 4 digits" value={form.last4} maxLength={4}
                    onChange={e => setForm({ ...form, last4: e.target.value })}
                    className="rounded-xl px-4 py-3.5 text-sm outline-none"
                    style={{ background: '#060e20', color: '#dae2fd', border: '1px solid rgba(70,69,85,0.3)' }} required />
                  <input placeholder="Card holder name" value={form.holderName}
                    onChange={e => setForm({ ...form, holderName: e.target.value })}
                    className="rounded-xl px-4 py-3.5 text-sm outline-none"
                    style={{ background: '#060e20', color: '#dae2fd', border: '1px solid rgba(70,69,85,0.3)' }} required />
                </div>
                <div className="flex gap-3">
                  <button type="submit"
                    className="px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)', color: '#1d00a5', boxShadow: '0 4px 15px rgba(79,70,229,0.3)' }}>
                    {editId ? 'Update' : 'Add Method'}
                  </button>
                  {editId && (
                    <button type="button" onClick={() => { setEditId(null); setForm({ type: 'CREDIT_CARD', last4: '', holderName: '' }); }}
                      className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: '#2d3449', color: '#c7c4d8' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        </div>

        {/* Right: Summary */}
        <aside className="md:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl p-8" style={{ background: '#131b2e', border: '1px solid rgba(70,69,85,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: '#dae2fd' }}>Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span style={{ color: '#918fa1' }}>Total Methods</span>
                  <span className="font-bold" style={{ color: '#dae2fd' }}>{pms.length}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#918fa1' }}>Credit Cards</span>
                  <span className="font-bold" style={{ color: '#dae2fd' }}>{pms.filter((p: any) => p.type === 'CREDIT_CARD').length}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#918fa1' }}>Debit Cards</span>
                  <span className="font-bold" style={{ color: '#dae2fd' }}>{pms.filter((p: any) => p.type === 'DEBIT_CARD').length}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#918fa1' }}>UPI</span>
                  <span className="font-bold" style={{ color: '#dae2fd' }}>{pms.filter((p: any) => p.type === 'UPI').length}</span>
                </div>
              </div>
              <div className="pt-4 border-t" style={{ borderColor: 'rgba(70,69,85,0.2)' }}>
                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <span className="text-xl">🔒</span>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: '#a5b4fc' }}>Secure & Encrypted</h4>
                    <p className="text-xs mt-1" style={{ color: 'rgba(165,180,252,0.7)' }}>All payment data is encrypted and stored securely.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role rewards style card */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(164,65,0,0.1)', border: '1px solid rgba(164,65,0,0.2)' }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">⭐</span>
                <span className="font-bold" style={{ color: '#ffb695' }}>Admin Privileges</span>
              </div>
              <p className="text-sm" style={{ color: '#ffd2be' }}>You have full access to manage all payment methods for your account.</p>
            </div>
          </div>
        </aside>
      </main>
    </AppShell>
  );
}
