'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { MY_ORDERS, ALL_PAYMENT_METHODS, PLACE_ORDER, CANCEL_ORDER } from '@/lib/queries';
import AppShell from '@/components/AppShell';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: ordersData, loading, refetch } = useQuery(MY_ORDERS, { fetchPolicy: 'network-only' }) as any;
  const { data: pmData } = useQuery(ALL_PAYMENT_METHODS, { fetchPolicy: 'network-only' }) as any;
  const [placeOrder] = useMutation(PLACE_ORDER) as any;
  const [cancelOrder] = useMutation(CANCEL_ORDER) as any;
  const [checkoutId, setCheckoutId] = useState<number | null>(null);
  const [selectedPM, setSelectedPM] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);
  if (!user) return null;

  const canCheckout = user.role === 'ADMIN' || user.role === 'MANAGER';
  const canCancel = user.role === 'ADMIN' || user.role === 'MANAGER';

  const orders = ordersData?.myOrders || [];
  const activeOrders = orders.filter((o: any) => o.status === 'PENDING');
  const pastOrders = orders.filter((o: any) => o.status !== 'PENDING');

  const handlePlace = async (orderId: number) => {
    if (!selectedPM) { setMsg('Select a payment method'); return; }
    try {
      await placeOrder({ variables: { orderId, paymentMethodId: selectedPM } });
      setMsg('✅ Order placed!'); setCheckoutId(null); refetch();
    } catch (e: any) { setMsg(`❌ ${e.message}`); }
  };

  const handleCancel = async (orderId: number) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await cancelOrder({ variables: { orderId } });
      setMsg('✅ Order cancelled.'); refetch();
    } catch (e: any) { setMsg(`❌ ${e.message}`); }
  };

  const formatPrice = (p: number) => p < 100 ? `$${p.toFixed(2)}` : `₹${p.toFixed(0)}`;

  const statusBadge = (s: string) => {
    if (s === 'PLACED') return { bg: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: 'rgba(16,185,129,0.3)', label: 'Delivered' };
    if (s === 'CANCELLED') return { bg: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: 'rgba(239,68,68,0.3)', label: 'Cancelled' };
    return { bg: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: 'rgba(99,102,241,0.3)', label: 'In Preparation' };
  };

  return (
    <AppShell>
      <main className="pt-4 sm:pt-6 px-4 sm:px-6 pb-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-1" style={{ color: '#dae2fd' }}>Order History</h1>
          <p className="text-sm" style={{ color: '#c7c4d8' }}>Track and manage your gastronomic journeys.</p>
        </div>

        {msg && (
          <div className="mb-6 p-4 rounded-xl text-sm"
            style={{ background: msg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msg.startsWith('✅') ? '#6ee7b7' : '#fca5a5', border: `1px solid ${msg.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {msg}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Active Orders */}
            <section className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full" style={{ background: '#c3c0ff', boxShadow: '0 0 8px rgba(195,192,255,0.8)' }} />
                <h2 className="text-xl font-bold" style={{ color: '#dae2fd' }}>Active Orders</h2>
              </div>

              {activeOrders.length === 0 ? (
                <div className="rounded-2xl p-10 text-center" style={{ background: '#171f33', border: '1px solid rgba(70,69,85,0.1)' }}>
                  <p className="text-4xl mb-3">🛒</p>
                  <p className="font-semibold mb-1" style={{ color: '#dae2fd' }}>No active orders</p>
                  <p className="text-sm mb-4" style={{ color: '#918fa1' }}>Browse restaurants to place an order</p>
                  <button onClick={() => router.push('/restaurants')}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
                    style={{ background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)', color: '#1d00a5' }}>
                    Browse Restaurants
                  </button>
                </div>
              ) : (
                activeOrders.map((order: any) => {
                  const badge = statusBadge(order.status);
                  return (
                    <div key={order.id} className="rounded-2xl overflow-hidden transition-all duration-300"
                      style={{ background: '#171f33', border: '1px solid rgba(70,69,85,0.1)' }}>
                      <div className="flex flex-col md:flex-row">
                        {/* Left color bar */}
                        <div className="w-full md:w-1.5 h-1.5 md:h-auto rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                          style={{ background: 'linear-gradient(to bottom, #c3c0ff, #4f46e5)' }} />
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold" style={{ color: '#dae2fd' }}>Order #{order.id}</h3>
                              <p className="text-sm" style={{ color: '#918fa1' }}>{new Date(order.createdAt).toLocaleString()} · {order.items.length} items</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                              style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                              {badge.label}
                            </span>
                          </div>

                          {/* Items */}
                          <div className="space-y-1 mb-4">
                            {order.items.map((item: any) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span style={{ color: '#c7c4d8' }}>{item.menuItem.name} × {item.quantity}</span>
                                <span style={{ color: '#918fa1' }}>{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-6 mb-4 pt-3" style={{ borderTop: '1px solid rgba(70,69,85,0.2)' }}>
                            <div>
                              <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: '#aeb9d0' }}>Total</p>
                              <p className="text-xl font-bold" style={{ color: '#c3c0ff' }}>{formatPrice(order.totalAmount)}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3 flex-wrap">
                            {canCheckout && (
                              checkoutId === order.id ? (
                                <div className="flex-1 space-y-2">
                                  <select onChange={e => setSelectedPM(parseInt(e.target.value))}
                                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                                    style={{ background: '#0f1829', color: '#dae2fd', border: '1px solid rgba(70,69,85,0.3)' }}>
                                    <option value="">Select payment method</option>
                                    {pmData?.allPaymentMethods?.map((pm: any) => (
                                      <option key={pm.id} value={pm.id}>{pm.type.replace('_', ' ')} •••• {pm.last4}</option>
                                    ))}
                                  </select>
                                  {!pmData?.allPaymentMethods?.length && (
                                    <p className="text-xs" style={{ color: '#ffb695' }}>No payment methods. Admin must add one first.</p>
                                  )}
                                  <div className="flex gap-2">
                                    <button onClick={() => handlePlace(order.id)}
                                      className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
                                      style={{ background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)', color: '#1d00a5' }}>
                                      Place Order
                                    </button>
                                    <button onClick={() => setCheckoutId(null)}
                                      className="px-4 py-2.5 rounded-xl text-sm transition-all"
                                      style={{ background: '#2d3449', color: '#c7c4d8' }}>
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button onClick={() => setCheckoutId(order.id)}
                                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                                  style={{ background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)', color: '#1d00a5' }}>
                                  Proceed to Checkout
                                </button>
                              )
                            )}
                            {canCancel && (
                              <button onClick={() => handleCancel(order.id)}
                                className="ml-auto px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                                style={{ background: 'rgba(147,0,10,0.2)', color: '#ffb4ab', border: '1px solid rgba(147,0,10,0.3)' }}>
                                Cancel Order
                              </button>
                            )}
                            {!canCheckout && !canCancel && (
                              <p className="text-sm italic" style={{ color: '#918fa1' }}>Waiting for manager to checkout</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </section>

            {/* Right: User summary + past orders */}
            <aside className="lg:col-span-4 space-y-6">
              {/* User card */}
              <div className="rounded-2xl p-6" style={{ background: '#131b2e', border: '1px solid rgba(70,69,85,0.1)' }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{ background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)', color: '#1d00a5' }}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#918fa1' }}>Welcome back,</p>
                    <h4 className="text-lg font-bold" style={{ color: '#dae2fd' }}>{user.name}</h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-4" style={{ background: '#171f33' }}>
                    <p className="text-xs uppercase font-bold mb-1" style={{ color: '#918fa1' }}>Total Orders</p>
                    <p className="text-2xl font-bold" style={{ color: '#c3c0ff' }}>{orders.length}</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: '#171f33' }}>
                    <p className="text-xs uppercase font-bold mb-1" style={{ color: '#918fa1' }}>Role</p>
                    <p className="text-lg font-bold" style={{ color: '#ffb695' }}>{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Past orders */}
              {pastOrders.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#918fa1' }}>Past Orders</h3>
                  <div className="space-y-2">
                    {pastOrders.slice(0, 5).map((order: any) => {
                      const badge = statusBadge(order.status);
                      return (
                        <div key={order.id}
                          className="group flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer"
                          style={{ background: '#131b2e', border: '1px solid rgba(70,69,85,0.1)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#171f33')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#131b2e')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ background: '#222a3d' }}>
                              <span className="text-sm">🍽️</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold" style={{ color: '#dae2fd' }}>Order #{order.id}</h4>
                              <p className="text-xs" style={{ color: '#918fa1' }}>{new Date(order.createdAt).toLocaleDateString()} · {formatPrice(order.totalAmount)}</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full font-semibold"
                            style={{ background: badge.bg, color: badge.color }}>
                            {badge.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}
      </main>
    </AppShell>
  );
}
