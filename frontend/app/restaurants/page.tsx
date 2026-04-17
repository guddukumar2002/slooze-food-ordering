'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { GET_RESTAURANTS, CREATE_ORDER, ADD_ITEM } from '@/lib/queries';
import AppShell from '@/components/AppShell';

export default function RestaurantsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, loading } = useQuery(GET_RESTAURANTS, { fetchPolicy: 'network-only' }) as any;
  const [createOrder] = useMutation(CREATE_ORDER) as any;
  const [addItem] = useMutation(ADD_ITEM) as any;
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [msg, setMsg] = useState('');

  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);
  if (!user) return null;

  const restaurants = data?.restaurants || [];
  const categories = ['All', ...Array.from(new Set(restaurants.map((r: any) => r.cuisine))) as string[]];

  const filtered = activeCategory === 'All' ? restaurants : restaurants.filter((r: any) => r.cuisine === activeCategory);

  const startOrder = async (restaurant: any) => {
    const result = await createOrder();
    setActiveOrder(result.data.createOrder);
    setSelectedRestaurant(restaurant);
    setCart({});
    setMsg('');
  };

  const addToCart = (id: number) => setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const removeFromCart = (id: number) => setCart(p => { const n = { ...p }; if (n[id] > 1) n[id]--; else delete n[id]; return n; });

  const submitCart = async () => {
    if (!activeOrder || !Object.keys(cart).length) return;
    try {
      for (const [menuItemId, quantity] of Object.entries(cart)) {
        await addItem({ variables: { orderId: activeOrder.id, menuItemId: parseInt(menuItemId), quantity } });
      }
      setMsg(`✅ Items added to Order #${activeOrder.id}!`);
      setCart({});
      setSelectedRestaurant(null);
    } catch (e: any) { setMsg(`❌ ${e.message}`); }
  };

  const cartCount = Object.values(cart).reduce((a: any, b: any) => a + b, 0);
  const cartTotal = selectedRestaurant
    ? Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = selectedRestaurant.menuItems.find((m: any) => m.id === parseInt(id));
        return sum + (item?.price || 0) * (qty as number);
      }, 0) : 0;

  const formatPrice = (p: number) => `₹${p.toFixed(0)}`;

  return (
    <AppShell>
      <main className="pt-6 pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="mb-6">
          <div className="mb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1" style={{ color: '#dae2fd' }}>Explore Cuisine</h1>
            <p className="text-sm flex items-center gap-2 flex-wrap" style={{ color: '#94a3b8' }}>
              Discover the finest dining experiences, curated for your region.
              {user.country !== 'ALL' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#a44100', color: '#ffd2be' }}>
                  {user.country} only
                </span>
              )}
            </p>
          </div>
          {/* Category filter — horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 sm:mx-0 px-4 sm:px-0" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeCategory === cat ? '#4f46e5' : '#1e2a45',
                  color: activeCategory === cat ? '#dad7ff' : '#94a3b8',
                  border: `1px solid ${activeCategory === cat ? 'rgba(99,102,241,0.5)' : 'rgba(70,69,85,0.3)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {msg && (
          <div className="mb-6 p-4 rounded-xl text-sm flex items-center justify-between"
            style={{ background: msg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msg.startsWith('✅') ? '#6ee7b7' : '#fca5a5' }}>
            <span>{msg}</span>
            {msg.startsWith('✅') && (
              <button onClick={() => router.push('/orders')} className="underline font-semibold ml-4">View Orders →</button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p style={{ color: '#c7c4d8' }}>Loading restaurants...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {filtered.map((r: any, i: number) => {
              const isSelected = selectedRestaurant?.id === r.id;
              const isFeatured = i === 0;
              return (
                <div key={r.id}
                  className={`group relative overflow-hidden rounded-3xl ${isFeatured ? 'md:col-span-8' : 'md:col-span-4'}`}
                  style={{ background: '#171f33', border: '1px solid rgba(70,69,85,0.1)' }}
                >
                  {/* Image */}
                  <div className={`w-full overflow-hidden ${isFeatured ? 'h-[320px]' : 'h-48'} relative`}>
                    <img src={r.imageUrl} alt={r.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={e => (e.currentTarget.src = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600`)}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,19,38,0.95) 0%, rgba(11,19,38,0.2) 60%, transparent 100%)' }} />
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(11,19,38,0.7)', color: '#c3c0ff', backdropFilter: 'blur(8px)', border: '1px solid rgba(195,192,255,0.2)' }}>
                        {r.country}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {isFeatured && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
                        style={{ background: 'rgba(164,65,0,0.3)', color: '#ffb695' }}>
                        Featured
                      </span>
                    )}
                    <div className="flex items-start justify-between mb-1">
                      <h2 className={`font-bold ${isFeatured ? 'text-2xl' : 'text-xl'}`} style={{ color: '#dae2fd' }}>{r.name}</h2>
                      <span className="text-sm font-semibold" style={{ color: '#c3c0ff' }}>4.8 ★</span>
                    </div>
                    <p className="text-sm mb-4" style={{ color: '#918fa1' }}>{r.cuisine}</p>

                    {isSelected ? (
                      <div>
                        {/* Category tabs */}
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                          {Array.from(new Set(r.menuItems.map((m: any) => m.category))) .map((cat: any) => (
                            <span key={cat} className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium"
                              style={{ background: '#222a3d', color: '#c7c4d8' }}>{cat}</span>
                          ))}
                        </div>
                        {/* Menu items */}
                        <div className="space-y-2 max-h-64 overflow-y-auto mb-4 pr-1">
                          {r.menuItems.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between rounded-xl px-3 py-2.5"
                              style={{ background: '#0f1829', border: '1px solid rgba(70,69,85,0.2)' }}>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate" style={{ color: '#dae2fd' }}>{item.name}</p>
                                <p className="text-xs" style={{ color: '#918fa1' }}>{item.category} · {formatPrice(item.price)}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-3">
                                {cart[item.id] ? (
                                  <>
                                    <button onClick={() => removeFromCart(item.id)}
                                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                                      style={{ background: '#2d3449', color: '#c3c0ff' }}>−</button>
                                    <span className="text-sm font-bold w-4 text-center" style={{ color: '#dae2fd' }}>{cart[item.id]}</span>
                                  </>
                                ) : null}
                                <button onClick={() => addToCart(item.id)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all"
                                  style={{ background: '#4f46e5', color: '#dad7ff' }}>+</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {cartCount > 0 && (
                          <div className="border-t pt-3 mb-3" style={{ borderColor: 'rgba(70,69,85,0.2)' }}>
                            <div className="flex justify-between text-sm mb-3">
                              <span style={{ color: '#918fa1' }}>{cartCount} items</span>
                              <span className="font-bold" style={{ color: '#c3c0ff' }}>{formatPrice(cartTotal)}</span>
                            </div>
                            <button onClick={submitCart}
                              className="w-full py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                              style={{ background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)', color: '#1d00a5', boxShadow: '0 4px 15px rgba(79,70,229,0.3)' }}>
                              Add to Order
                            </button>
                          </div>
                        )}
                        <button onClick={() => { setSelectedRestaurant(null); setCart({}); }}
                          className="w-full text-xs py-2 rounded-xl transition-all"
                          style={{ color: '#918fa1', background: '#131b2e' }}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startOrder(r)}
                        className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #c3c0ff, #4f46e5)', color: '#1d00a5', boxShadow: '0 4px 15px rgba(79,70,229,0.3)' }}>
                        {isFeatured ? 'View Selection' : 'Order Now'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating cart bar */}
        {activeOrder && cartCount > 0 && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg z-50">
            <div className="rounded-2xl p-4 flex items-center justify-between"
              style={{ background: 'rgba(79,70,229,0.9)', backdropFilter: 'blur(24px)', boxShadow: '0 20px 50px rgba(79,70,229,0.4)' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛒</span>
                <div>
                  <p className="text-white text-sm font-bold">{cartCount} item{cartCount > 1 ? 's' : ''} added</p>
                  <p className="text-indigo-200 text-xs">Order #{activeOrder.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-extrabold">{formatPrice(cartTotal)}</span>
                <button onClick={submitCart}
                  className="bg-white px-5 py-2 rounded-xl font-bold text-sm transition-colors"
                  style={{ color: '#4f46e5' }}>
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
