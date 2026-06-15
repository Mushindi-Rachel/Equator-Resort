import { useState, useEffect } from 'react';
import {
  X, Users, Calendar, CreditCard, CheckCircle2, Clock, Search,
  ChevronDown, LogOut, Plus, RefreshCw, Building2, Baby, Star,
  MessageSquare, ThumbsUp, XCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Booking, Room, Profile } from '../lib/supabase';

interface AdminDashboardProps {
  onClose: () => void;
  adminUser: { id: string; email: string };
}

type Tab = 'bookings' | 'new-booking' | 'reviews';

interface Review {
  id: string;
  booking_id: string | null;
  guest_name: string;
  guest_email: string | null;
  rating: number;
  comment: string | null;
  is_published: boolean;
  created_at: string;
}

function statusColor(status: string) {
  if (status === 'paid') return 'bg-green-100 text-green-700';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

function confirmationColor(status: string) {
  if (status === 'confirmed') return 'bg-blue-100 text-blue-700';
  if (status === 'rejected') return 'bg-red-100 text-red-700';
  return 'bg-amber-100 text-amber-700';
}

function generateRef() {
  return 'EPR-' + Math.random().toString(36).toUpperCase().substring(2, 8);
}

function nightsBetween(checkin: string, checkout: string) {
  const a = new Date(checkin).getTime();
  const b = new Date(checkout).getTime();
  return Math.max(1, Math.round((b - a) / (1000 * 60 * 60 * 24)));
}

export default function AdminDashboard({ onClose, adminUser }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('bookings');
  const [bookings, setBookings] = useState<(Booking & { rooms?: Room; profiles?: Profile })[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newBooking, setNewBooking] = useState({
    guestName: '', guestEmail: '', guestPhone: '',
    checkIn: '', checkOut: '', adults: 1, children: 0,
    roomId: '', paymentMethod: 'mpesa', mpesaNumber: '', paymentStatus: 'paid',
  });
  const [savingBooking, setSavingBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [newReview, setNewReview] = useState({
    bookingId: '', guestName: '', guestEmail: '', rating: 5, comment: '',
  });
  const [savingReview, setSavingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    setLoading(true);
    const [bookingsRes, roomsRes, reviewsRes] = await Promise.all([
      supabase
        .from('bookings')
        .select('*, rooms(*), profiles(*)')
        .order('created_at', { ascending: false }),
      supabase.from('rooms').select('*').order('room_number'),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
    ]);

    if (bookingsRes.data) {
      setBookings(bookingsRes.data.map(b => ({
        ...b,
        rooms: b.rooms ? {
          ...b.rooms,
          amenities: typeof b.rooms.amenities === 'string' ? JSON.parse(b.rooms.amenities) : b.rooms.amenities,
          images: typeof b.rooms.images === 'string' ? JSON.parse(b.rooms.images) : b.rooms.images,
        } : undefined,
      })));
    }
    if (roomsRes.data) {
      setRooms(roomsRes.data.map(r => ({
        ...r,
        amenities: typeof r.amenities === 'string' ? JSON.parse(r.amenities) : r.amenities,
        images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images,
      })));
    }
    if (reviewsRes.data) {
      setReviews(reviewsRes.data as Review[]);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    return (
      b.guest_name?.toLowerCase().includes(q) ||
      b.guest_email?.toLowerCase().includes(q) ||
      b.booking_reference?.toLowerCase().includes(q) ||
      b.rooms?.name?.toLowerCase().includes(q) ||
      b.rooms?.room_number?.includes(q)
    );
  });

  const stats = {
    total: bookings.length,
    paid: bookings.filter(b => b.payment_status === 'paid').length,
    pending: bookings.filter(b => b.payment_status === 'pending').length,
    confirmed: bookings.filter(b => (b as Booking & { confirmation_status?: string }).confirmation_status === 'confirmed').length,
    revenue: bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.total_amount || 0), 0),
  };

  const updateConfirmation = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ confirmation_status: status })
      .eq('id', bookingId);
    if (error) return;
    loadData();
  };

  const handleNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.roomId) { setBookingError('Please select a room'); return; }
    if (!newBooking.checkIn || !newBooking.checkOut) { setBookingError('Please select dates'); return; }
    if (newBooking.checkIn >= newBooking.checkOut) { setBookingError('Check-out must be after check-in'); return; }
    setSavingBooking(true);
    setBookingError('');
    setBookingSuccess('');

    try {
      const room = rooms.find(r => r.id === parseInt(newBooking.roomId));
      if (!room) throw new Error('Room not found');
      const nights = nightsBetween(newBooking.checkIn, newBooking.checkOut);
      const total = nights * room.price_per_night;
      const ref = generateRef();

      const { error } = await supabase.from('bookings').insert({
        user_id: adminUser.id,
        room_id: parseInt(newBooking.roomId),
        check_in: newBooking.checkIn,
        check_out: newBooking.checkOut,
        adults: newBooking.adults,
        children: newBooking.children,
        guest_name: newBooking.guestName,
        guest_email: newBooking.guestEmail,
        guest_phone: newBooking.guestPhone,
        payment_method: newBooking.paymentMethod,
        mpesa_number: newBooking.mpesaNumber,
        payment_status: newBooking.paymentStatus,
        total_amount: total,
        booking_reference: ref,
        confirmation_status: 'confirmed',
        notes: 'Booked by admin',
      });

      if (error) throw error;
      setBookingSuccess(`Booking confirmed! Ref: ${ref}`);
      setNewBooking({ guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', adults: 1, children: 0, roomId: '', paymentMethod: 'mpesa', mpesaNumber: '', paymentStatus: 'paid' });
      loadData();
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setSavingBooking(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.guestName.trim()) { setReviewError('Guest name is required'); return; }
    setSavingReview(true);
    setReviewError('');

    try {
      const { error } = await supabase.from('reviews').insert({
        booking_id: newReview.bookingId || null,
        guest_name: newReview.guestName,
        guest_email: newReview.guestEmail || null,
        rating: newReview.rating,
        comment: newReview.comment || null,
        is_published: false,
      });

      if (error) throw error;
      setNewReview({ bookingId: '', guestName: '', guestEmail: '', rating: 5, comment: '' });
      loadData();
    } catch (err: unknown) {
      setReviewError(err instanceof Error ? err.message : 'Failed to add review');
    } finally {
      setSavingReview(false);
    }
  };

  const toggleReviewPublished = async (reviewId: string, currentPublished: boolean) => {
    await supabase.from('reviews').update({ is_published: !currentPublished }).eq('id', reviewId);
    loadData();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream-50 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="bg-sanctuary-900 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <p className="font-display text-cream-50 text-lg tracking-[0.2em] uppercase">Equator</p>
            <p className="font-sans text-gold-400 text-[9px] tracking-[0.3em] uppercase">Christian Retreat Centre</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-sans text-cream-200/60 text-xs hidden md:block">{adminUser.email}</span>
          <button onClick={handleSignOut} className="flex items-center gap-1.5 border border-cream-200/20 text-cream-200/60 hover:text-gold-400 hover:border-gold-400/40 px-3 py-1.5 font-sans text-[11px] transition-all cursor-none">
            <LogOut size={12} /> Sign Out
          </button>
          <button onClick={onClose} className="text-cream-200/60 hover:text-gold-400 transition-colors cursor-none">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-sanctuary-950 px-6 flex items-center gap-0 flex-shrink-0">
        {([['bookings', 'Bookings'], ['new-booking', 'New Booking'], ['reviews', 'Reviews']] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 font-sans text-[11px] tracking-[0.15em] uppercase font-semibold transition-all cursor-none border-b-2
              ${tab === t ? 'text-gold-400 border-gold-500' : 'text-sanctuary-400 border-transparent hover:text-sanctuary-200'}`}
          >
            {label}
          </button>
        ))}
        <button onClick={loadData} className="ml-auto text-sanctuary-400 hover:text-gold-400 transition-colors cursor-none py-3">
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats + Bookings */}
        {tab === 'bookings' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {[
                { label: 'Total', value: stats.total, icon: Calendar, color: 'text-blue-600' },
                { label: 'Paid', value: stats.paid, icon: CheckCircle2, color: 'text-green-600' },
                { label: 'Confirmed', value: stats.confirmed, icon: ThumbsUp, color: 'text-blue-600' },
                { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600' },
                { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: CreditCard, color: 'text-gold-600' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white border border-sanctuary-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans text-[10px] text-sanctuary-400 tracking-[0.15em] uppercase">{label}</span>
                    <Icon size={16} className={color} />
                  </div>
                  <p className="font-display text-sanctuary-900 text-2xl">{value}</p>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sanctuary-400" />
              <input
                type="text"
                placeholder="Search by guest name, email, reference, room..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-sanctuary-100 font-sans text-sm text-sanctuary-900 pl-9 pr-4 py-3 focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 rounded-full animate-spin" style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: '#e5e5e5', borderTopColor: '#d4a574' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white border border-sanctuary-100">
                <Building2 size={36} className="text-sanctuary-200 mx-auto mb-3" />
                <p className="font-serif text-sanctuary-600 text-lg">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(booking => {
                  const b = booking as Booking & { confirmation_status?: string; mpesa_transaction_id?: string };
                  return (
                    <div key={booking.id} className="bg-white border border-sanctuary-100 overflow-hidden">
                      <div
                        className="flex items-center p-4 cursor-none"
                        onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                      >
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div>
                            <p className="font-sans text-[10px] text-sanctuary-400 uppercase tracking-wider mb-0.5">Guest</p>
                            <p className="font-sans text-sanctuary-900 text-sm font-semibold">{booking.guest_name}</p>
                            <p className="font-sans text-sanctuary-400 text-[11px]">{booking.guest_email}</p>
                          </div>
                          <div>
                            <p className="font-sans text-[10px] text-sanctuary-400 uppercase tracking-wider mb-0.5">Room</p>
                            <p className="font-sans text-sanctuary-900 text-sm font-semibold">{booking.rooms?.name || 'N/A'}</p>
                            <p className="font-sans text-sanctuary-400 text-[11px]">Room {booking.rooms?.room_number}</p>
                          </div>
                          <div>
                            <p className="font-sans text-[10px] text-sanctuary-400 uppercase tracking-wider mb-0.5">Dates</p>
                            <p className="font-sans text-sanctuary-900 text-sm">{booking.check_in}</p>
                            <p className="font-sans text-sanctuary-400 text-[11px]">to {booking.check_out}</p>
                          </div>
                          <div>
                            <p className="font-sans text-[10px] text-sanctuary-400 uppercase tracking-wider mb-0.5">Payment</p>
                            <span className={`font-sans text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 inline-block ${statusColor(booking.payment_status)}`}>
                              {booking.payment_status}
                            </span>
                          </div>
                          <div className="flex flex-col items-start md:items-end">
                            <span className={`font-sans text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 mb-1 inline-block ${confirmationColor(b.confirmation_status || 'pending')}`}>
                              {b.confirmation_status || 'pending'}
                            </span>
                            <p className="font-display text-sanctuary-900 text-lg">${booking.total_amount?.toLocaleString()}</p>
                          </div>
                        </div>
                        <ChevronDown size={16} className={`text-sanctuary-400 ml-3 transition-transform flex-shrink-0 ${expandedId === booking.id ? 'rotate-180' : ''}`} />
                      </div>

                      {expandedId === booking.id && (
                        <div className="border-t border-sanctuary-100 bg-sanctuary-50 p-5">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            {[
                              ['Booking Reference', booking.booking_reference],
                              ['Phone', booking.guest_phone || '\u2014'],
                              ['Adults', booking.adults],
                              ['Children', booking.children],
                              ['Payment Method', booking.payment_method?.toUpperCase()],
                              ['M-Pesa Number', booking.mpesa_number || '\u2014'],
                              ['M-Pesa Txn ID', b.mpesa_transaction_id || '\u2014'],
                              ['Check-in', booking.check_in],
                              ['Check-out', booking.check_out],
                              ['Booked On', new Date(booking.created_at).toLocaleDateString()],
                              ['Total Amount', `$${booking.total_amount?.toLocaleString()}`],
                              ['Room Size', booking.rooms ? `${booking.rooms.size_sqm}m\u00B2` : '\u2014'],
                              ['Notes', booking.notes || '\u2014'],
                            ].map(([label, value]) => (
                              <div key={String(label)}>
                                <p className="font-sans text-[10px] text-sanctuary-400 uppercase tracking-wider mb-0.5">{label}</p>
                                <p className="font-sans text-sanctuary-900 text-sm">{String(value)}</p>
                              </div>
                            ))}
                          </div>

                          {/* Confirmation Actions */}
                          <div className="border-t border-sanctuary-200 pt-4">
                            <p className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase mb-3">Confirmation</p>
                            <div className="flex flex-wrap gap-2">
                              {(b.confirmation_status || 'pending') === 'pending' && (
                                <>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateConfirmation(booking.id, 'confirmed'); }}
                                    className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 font-sans text-[11px] tracking-wider uppercase hover:bg-green-700 transition-colors cursor-none"
                                  >
                                    <ThumbsUp size={13} /> Confirm Booking
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateConfirmation(booking.id, 'rejected'); }}
                                    className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 font-sans text-[11px] tracking-wider uppercase hover:bg-red-700 transition-colors cursor-none"
                                  >
                                    <XCircle size={13} /> Reject
                                  </button>
                                </>
                              )}
                              {b.confirmation_status === 'confirmed' && (
                                <span className="flex items-center gap-1.5 text-green-700 font-sans text-xs">
                                  <CheckCircle2 size={14} /> This booking has been confirmed
                                </span>
                              )}
                              {b.confirmation_status === 'rejected' && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateConfirmation(booking.id, 'pending'); }}
                                  className="flex items-center gap-1.5 border border-sanctuary-300 text-sanctuary-600 px-4 py-2 font-sans text-[11px] tracking-wider uppercase hover:border-gold-400 hover:text-gold-600 transition-colors cursor-none"
                                >
                                  Reconsider
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* New Booking Tab */}
        {tab === 'new-booking' && (
          <div className="max-w-2xl">
            <h2 className="font-serif text-sanctuary-900 text-2xl mb-2">Create New Booking</h2>
            <p className="font-sans text-sanctuary-500 text-sm mb-6">Book a room on behalf of a guest.</p>

            {bookingSuccess && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 font-sans text-sm mb-6">
                <CheckCircle2 size={16} /> {bookingSuccess}
              </div>
            )}

            <form onSubmit={handleNewBooking} className="space-y-6">
              <div className="bg-white border border-sanctuary-100 p-5">
                <p className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase mb-4">Guest Information</p>
                <div className="space-y-4">
                  <div>
                    <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Full Name</label>
                    <input type="text" required placeholder="John Doe" value={newBooking.guestName} onChange={e => setNewBooking(p => ({ ...p, guestName: e.target.value }))} className="input-luxury w-full font-sans text-sm text-sanctuary-900 bg-transparent" />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Email</label>
                    <input type="email" required placeholder="guest@example.com" value={newBooking.guestEmail} onChange={e => setNewBooking(p => ({ ...p, guestEmail: e.target.value }))} className="input-luxury w-full font-sans text-sm text-sanctuary-900 bg-transparent" />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Phone Number</label>
                    <input type="tel" placeholder="+254 700 123 456" value={newBooking.guestPhone} onChange={e => setNewBooking(p => ({ ...p, guestPhone: e.target.value }))} className="input-luxury w-full font-sans text-sm text-sanctuary-900 bg-transparent" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-sanctuary-100 p-5">
                <p className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase mb-4">Stay Details</p>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">
                      <Calendar size={11} className="inline mr-1" /> Check-in
                    </label>
                    <input type="date" required min={today} value={newBooking.checkIn} onChange={e => setNewBooking(p => ({ ...p, checkIn: e.target.value }))} className="input-luxury w-full font-sans text-sm text-sanctuary-900 bg-transparent" />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">
                      <Calendar size={11} className="inline mr-1" /> Check-out
                    </label>
                    <input type="date" required min={newBooking.checkIn || today} value={newBooking.checkOut} onChange={e => setNewBooking(p => ({ ...p, checkOut: e.target.value }))} className="input-luxury w-full font-sans text-sm text-sanctuary-900 bg-transparent" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">
                      <Users size={11} className="inline mr-1" /> Adults
                    </label>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setNewBooking(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))} className="w-7 h-7 border border-gold-400 text-gold-600 hover:bg-gold-500 hover:text-sanctuary-900 transition-all flex items-center justify-center font-bold cursor-none text-sm">-</button>
                      <span className="font-serif text-sanctuary-900 text-lg w-4 text-center">{newBooking.adults}</span>
                      <button type="button" onClick={() => setNewBooking(p => ({ ...p, adults: Math.min(6, p.adults + 1) }))} className="w-7 h-7 border border-gold-400 text-gold-600 hover:bg-gold-500 hover:text-sanctuary-900 transition-all flex items-center justify-center font-bold cursor-none text-sm">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">
                      <Baby size={11} className="inline mr-1" /> Children
                    </label>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setNewBooking(p => ({ ...p, children: Math.max(0, p.children - 1) }))} className="w-7 h-7 border border-gold-400 text-gold-600 hover:bg-gold-500 hover:text-sanctuary-900 transition-all flex items-center justify-center font-bold cursor-none text-sm">-</button>
                      <span className="font-serif text-sanctuary-900 text-lg w-4 text-center">{newBooking.children}</span>
                      <button type="button" onClick={() => setNewBooking(p => ({ ...p, children: Math.min(5, p.children + 1) }))} className="w-7 h-7 border border-gold-400 text-gold-600 hover:bg-gold-500 hover:text-sanctuary-900 transition-all flex items-center justify-center font-bold cursor-none text-sm">+</button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">
                    <Building2 size={11} className="inline mr-1" /> Room
                  </label>
                  <select required value={newBooking.roomId} onChange={e => setNewBooking(p => ({ ...p, roomId: e.target.value }))} className="w-full border-b border-sanctuary-200 bg-transparent font-sans text-sm text-sanctuary-900 py-2 focus:outline-none focus:border-gold-400 transition-colors">
                    <option value="">Select a room</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>Room {r.room_number} &ndash; {r.name} (${r.price_per_night}/night)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white border border-sanctuary-100 p-5">
                <p className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase mb-4">Payment</p>
                <div className="grid grid-cols-2 gap-5 mb-4">
                  <div>
                    <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">M-Pesa Number</label>
                    <input type="tel" value={newBooking.mpesaNumber} onChange={e => setNewBooking(p => ({ ...p, mpesaNumber: e.target.value }))} className="input-luxury w-full font-sans text-sm text-sanctuary-900 bg-transparent" placeholder="0712 345 678" />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Payment Status</label>
                    <select value={newBooking.paymentStatus} onChange={e => setNewBooking(p => ({ ...p, paymentStatus: e.target.value }))} className="w-full border-b border-sanctuary-200 bg-transparent font-sans text-sm text-sanctuary-900 py-2 focus:outline-none focus:border-gold-400 transition-colors">
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                {newBooking.roomId && newBooking.checkIn && newBooking.checkOut && newBooking.checkIn < newBooking.checkOut && (
                  <div className="bg-sanctuary-900 text-cream-50 p-4 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-[11px] text-cream-200/70">
                        {rooms.find(r => r.id === parseInt(newBooking.roomId))?.name} &middot; {nightsBetween(newBooking.checkIn, newBooking.checkOut)} nights
                      </span>
                      <span className="font-display text-gold-400 text-lg">
                        ${(nightsBetween(newBooking.checkIn, newBooking.checkOut) * (rooms.find(r => r.id === parseInt(newBooking.roomId))?.price_per_night || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {bookingError && <p className="text-red-500 font-sans text-sm">{bookingError}</p>}

              <button type="submit" disabled={savingBooking} className="btn-gold w-full justify-center disabled:opacity-50">
                {savingBooking ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-sanctuary-900/30 border-t-sanctuary-900 rounded-full animate-spin" />
                    Creating booking...
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><Plus size={15} /> Create Booking</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Reviews Tab */}
        {tab === 'reviews' && (
          <div className="max-w-3xl">
            <h2 className="font-serif text-sanctuary-900 text-2xl mb-2">Guest Reviews</h2>
            <p className="font-sans text-sanctuary-500 text-sm mb-6">Add and manage guest reviews.</p>

            {/* Add Review Form */}
            <div className="bg-white border border-sanctuary-100 p-5 mb-6">
              <p className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase mb-4">Add New Review</p>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Guest Name</label>
                    <input type="text" required value={newReview.guestName} onChange={e => setNewReview(p => ({ ...p, guestName: e.target.value }))} className="input-luxury w-full font-sans text-sm text-sanctuary-900 bg-transparent" placeholder="Guest name" />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Email (optional)</label>
                    <input type="email" value={newReview.guestEmail} onChange={e => setNewReview(p => ({ ...p, guestEmail: e.target.value }))} className="input-luxury w-full font-sans text-sm text-sanctuary-900 bg-transparent" placeholder="guest@email.com" />
                  </div>
                </div>
                <div>
                  <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(i => (
                      <button key={i} type="button" onClick={() => setNewReview(p => ({ ...p, rating: i }))} className="cursor-none">
                        <Star size={20} className={i <= newReview.rating ? 'text-gold-500 fill-gold-500' : 'text-sanctuary-200'} />
                      </button>
                    ))}
                    <span className="font-sans text-sanctuary-600 text-sm ml-2">{newReview.rating}/5</span>
                  </div>
                </div>
                <div>
                  <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Comment</label>
                  <textarea value={newReview.comment} onChange={e => setNewReview(p => ({ ...p, comment: e.target.value }))} className="w-full border-b border-sanctuary-200 bg-transparent font-sans text-sm text-sanctuary-900 py-2 focus:outline-none focus:border-gold-400 transition-colors resize-none" rows={3} placeholder="Guest's review..." />
                </div>
                <div>
                  <label className="font-sans text-[10px] text-sanctuary-500 tracking-[0.2em] uppercase block mb-2">Linked Booking (optional)</label>
                  <select value={newReview.bookingId} onChange={e => setNewReview(p => ({ ...p, bookingId: e.target.value }))} className="w-full border-b border-sanctuary-200 bg-transparent font-sans text-sm text-sanctuary-900 py-2 focus:outline-none focus:border-gold-400 transition-colors">
                    <option value="">No linked booking</option>
                    {bookings.map(b => (
                      <option key={b.id} value={b.id}>{b.booking_reference} - {b.guest_name}</option>
                    ))}
                  </select>
                </div>
                {reviewError && <p className="text-red-500 font-sans text-sm">{reviewError}</p>}
                <button type="submit" disabled={savingReview} className="btn-gold w-full justify-center disabled:opacity-50">
                  {savingReview ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-sanctuary-900/30 border-t-sanctuary-900 rounded-full animate-spin" />
                      Adding review...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><MessageSquare size={15} /> Add Review</span>
                  )}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-white border border-sanctuary-100">
                  <MessageSquare size={36} className="text-sanctuary-200 mx-auto mb-3" />
                  <p className="font-serif text-sanctuary-600 text-lg">No reviews yet</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="bg-white border border-sanctuary-100 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-sans text-sanctuary-900 text-sm font-semibold">{review.guest_name}</p>
                          <span className={`font-sans text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 ${review.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {review.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-2">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={12} className={i <= review.rating ? 'text-gold-500 fill-gold-500' : 'text-sanctuary-200'} />
                          ))}
                        </div>
                        {review.comment && (
                          <p className="font-sans text-sanctuary-600 text-sm">{review.comment}</p>
                        )}
                        <p className="font-sans text-sanctuary-400 text-[10px] mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => toggleReviewPublished(review.id, review.is_published)}
                        className={`px-3 py-1.5 font-sans text-[10px] tracking-wider uppercase transition-all cursor-none ${
                          review.is_published
                            ? 'border border-red-200 text-red-600 hover:bg-red-50'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {review.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
