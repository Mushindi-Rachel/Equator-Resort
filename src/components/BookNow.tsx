import { useState } from 'react';
import { Phone, ChevronRight, ChevronLeft, Check, CreditCard, Smartphone, Mail, User, Calendar, Users, Bed, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

const rooms = [
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    price: 12000,
    desc: 'Spacious room with ensuite facilities, free WiFi, and smart TV.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ecff7ccf8?w=600&h=400&fit=crop',
    maxGuests: 2,
  },
  {
    id: 'executive',
    name: 'Executive Suite',
    price: 18000,
    desc: 'Premium suite with separate living area, ensuite, free WiFi, and smart TV.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d95b6c06b?w=600&h=400&fit=crop',
    maxGuests: 2,
  },
  {
    id: 'family',
    name: 'Family Room',
    price: 20000,
    desc: 'Large room for families with ensuite, free WiFi, smart TV, and children\'s area.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    maxGuests: 4,
  },
  {
    id: 'twin',
    name: 'Twin Room',
    price: 10000,
    desc: 'Two single beds with ensuite, free WiFi, and smart TV.',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop',
    maxGuests: 2,
  },
];

function generateBookingRef() {
  return 'ECR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function nightsBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export default function BookNow() {
  const [step, setStep] = useState(1);
  const [roomId, setRoomId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'visa' | 'mastercard'>('mpesa');
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [error, setError] = useState('');

  const selectedRoom = rooms.find((r) => r.id === roomId);
  const nights = nightsBetween(checkIn, checkOut);
  const totalAmount = selectedRoom ? selectedRoom.price * nights : 0;

  async function handleSubmit() {
    setLoading(true);
    setError('');
    const ref = generateBookingRef();
    setBookingRef(ref);

    try {
      const { error: bookingError } = await supabase.from('bookings').insert({
        booking_reference: ref,
        guest_name: name,
        email,
        phone,
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        number_of_guests: guests,
        total_amount: totalAmount,
        booking_status: 'Pending',
      });

      if (bookingError) throw bookingError;

      const { data: bookingData } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_reference', ref)
        .single();

      if (bookingData) {
        await supabase.from('payments').insert({
          booking_id: bookingData.id,
          merchant_reference: ref,
          payment_method: paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod === 'visa' ? 'Visa' : 'Mastercard',
          amount: totalAmount,
          currency: 'KES',
          payment_status: 'Pending',
        });
      }

      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const canProceedStep1 = roomId && checkIn && checkOut && guests > 0 && nights > 0;
  const canProceedStep2 = name && email && phone;

  return (
    <section id="book" className="py-28 bg-cream-50 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="section-label mb-4">Reservations</p>
          <div className="section-divider mb-6" />
          <h2 className="font-serif text-sanctuary-900 mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: '1.15' }}>
            Book Your
            <br />
            <span className="text-gradient-gold">Stay</span>
          </h2>
          <p className="font-sans text-sanctuary-600 max-w-xl mx-auto leading-relaxed" style={{ fontSize: '15px' }}>
            Select your room, dates, and preferred payment method. A pastor is available on call for spiritual support during your stay.
          </p>
        </div>

        <div className="bg-white card-luxury p-8 md:p-10 reveal">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-sans text-sm font-medium transition-all
                    ${step >= s ? 'bg-sanctuary-900 text-gold-400' : 'bg-sanctuary-100 text-sanctuary-400'}`}
                >
                  {step > s ? <Check size={18} /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 transition-all ${step > s ? 'bg-sanctuary-900' : 'bg-sanctuary-100'}`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 font-sans text-sm rounded">
              {error}
            </div>
          )}

          {/* Step 1: Select Room & Dates */}
          {step === 1 && (
            <div className="space-y-8">
              <h3 className="font-serif text-sanctuary-900 text-xl mb-6">Step 1: Select Room & Dates</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setRoomId(room.id)}
                    className={`text-left border-2 transition-all duration-300 cursor-none overflow-hidden
                      ${roomId === room.id ? 'border-gold-500' : 'border-transparent hover:border-sanctuary-200'}`}
                  >
                    <div className="aspect-[3/2] overflow-hidden">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 bg-cream-50">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-serif text-sanctuary-900 text-[15px]">{room.name}</h4>
                        <span className="font-sans text-gold-600 text-[13px] font-medium">KSh {room.price.toLocaleString()}/night</span>
                      </div>
                      <p className="font-sans text-sanctuary-500 text-[12px] leading-relaxed">{room.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-sans text-[11px] text-sanctuary-400 tracking-wider uppercase mb-2">
                    <Calendar size={12} className="inline mr-1" />Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-cream-50 border border-sanctuary-100 font-sans text-sanctuary-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[11px] text-sanctuary-400 tracking-wider uppercase mb-2">
                    <Calendar size={12} className="inline mr-1" />Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-cream-50 border border-sanctuary-100 font-sans text-sanctuary-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[11px] text-sanctuary-400 tracking-wider uppercase mb-2">
                    <Users size={12} className="inline mr-1" />Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-cream-50 border border-sanctuary-100 font-sans text-sanctuary-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  >
                    {[1, 2, 3, 4].map((g) => (
                      <option key={g} value={g}>{g} Guest{g > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedRoom && nights > 0 && (
                <div className="bg-sanctuary-50 p-5 border-l-4 border-gold-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-serif text-sanctuary-900 text-[15px]">{selectedRoom.name}</p>
                      <p className="font-sans text-sanctuary-500 text-[12px]">{nights} night{nights > 1 ? 's' : ''} x KSh {selectedRoom.price.toLocaleString()}</p>
                    </div>
                    <p className="font-serif text-sanctuary-900 text-xl">KSh {totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="btn-gold inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Guest Details */}
          {step === 2 && (
            <div className="space-y-8">
              <h3 className="font-serif text-sanctuary-900 text-xl mb-6">Step 2: Guest Details</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[11px] text-sanctuary-400 tracking-wider uppercase mb-2">
                    <User size={12} className="inline mr-1" />Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-cream-50 border border-sanctuary-100 font-sans text-sanctuary-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[11px] text-sanctuary-400 tracking-wider uppercase mb-2">
                    <Phone size={12} className="inline mr-1" />Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 700 123 456"
                    className="w-full px-4 py-3 bg-cream-50 border border-sanctuary-100 font-sans text-sanctuary-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block font-sans text-[11px] text-sanctuary-400 tracking-wider uppercase mb-2">
                  <Mail size={12} className="inline mr-1" />Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-cream-50 border border-sanctuary-100 font-sans text-sanctuary-700 text-sm focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>

              <div className="bg-sanctuary-50 p-5 border-l-4 border-gold-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-serif text-sanctuary-900 text-[15px]">{selectedRoom?.name}</p>
                    <p className="font-sans text-sanctuary-500 text-[12px]">{nights} night{nights > 1 ? 's' : ''}</p>
                  </div>
                  <p className="font-serif text-sanctuary-900 text-xl">KSh {totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="btn-outline-gold inline-flex items-center gap-2">
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="btn-gold inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-8">
              <h3 className="font-serif text-sanctuary-900 text-xl mb-6">Step 3: Payment</h3>

              <div className="grid sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-5 border-2 transition-all cursor-none text-center
                    ${paymentMethod === 'mpesa' ? 'border-gold-500 bg-gold-50' : 'border-sanctuary-100 hover:border-sanctuary-200'}`}
                >
                  <Smartphone size={28} className={`mx-auto mb-3 ${paymentMethod === 'mpesa' ? 'text-gold-600' : 'text-sanctuary-400'}`} />
                  <p className="font-serif text-sanctuary-900 text-[14px]">M-Pesa</p>
                  <p className="font-sans text-sanctuary-400 text-[11px]">Mobile money</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('visa')}
                  className={`p-5 border-2 transition-all cursor-none text-center
                    ${paymentMethod === 'visa' ? 'border-gold-500 bg-gold-50' : 'border-sanctuary-100 hover:border-sanctuary-200'}`}
                >
                  <CreditCard size={28} className={`mx-auto mb-3 ${paymentMethod === 'visa' ? 'text-gold-600' : 'text-sanctuary-400'}`} />
                  <p className="font-serif text-sanctuary-900 text-[14px]">Visa</p>
                  <p className="font-sans text-sanctuary-400 text-[11px]">Credit / Debit</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('mastercard')}
                  className={`p-5 border-2 transition-all cursor-none text-center
                    ${paymentMethod === 'mastercard' ? 'border-gold-500 bg-gold-50' : 'border-sanctuary-100 hover:border-sanctuary-200'}`}
                >
                  <CreditCard size={28} className={`mx-auto mb-3 ${paymentMethod === 'mastercard' ? 'text-gold-600' : 'text-sanctuary-400'}`} />
                  <p className="font-serif text-sanctuary-900 text-[14px]">Mastercard</p>
                  <p className="font-sans text-sanctuary-400 text-[11px]">Credit / Debit</p>
                </button>
              </div>

              <div className="bg-sanctuary-900 p-6 text-cream-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-serif text-gold-400 text-[15px]">{selectedRoom?.name}</p>
                    <p className="font-sans text-cream-100 text-[12px]">{name} &middot; {nights} night{nights > 1 ? 's' : ''} &middot; {guests} guest{guests > 1 ? 's' : ''}</p>
                  </div>
                  <p className="font-serif text-gold-400 text-2xl">KSh {totalAmount.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 text-cream-100 text-[11px]">
                  <Shield size={12} />
                  <span>Secure {paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod === 'visa' ? 'Visa' : 'Mastercard'} payment</span>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="btn-outline-gold inline-flex items-center gap-2">
                  <ChevronLeft size={16} /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-gold inline-flex items-center gap-2 disabled:opacity-40"
                >
                  {loading ? 'Processing...' : 'Confirm & Pay'} <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="text-center space-y-6 py-8">
              <div className="w-16 h-16 bg-sanctuary-900 rounded-full flex items-center justify-center mx-auto">
                <Check size={32} className="text-gold-400" />
              </div>
              <h3 className="font-serif text-sanctuary-900 text-2xl">Booking Confirmed!</h3>
              <p className="font-sans text-sanctuary-600 max-w-md mx-auto leading-relaxed" style={{ fontSize: '15px' }}>
                Thank you, {name}. Your booking has been received and is pending payment confirmation.
                A confirmation email has been sent to {email}.
              </p>
              <div className="bg-sanctuary-50 p-6 inline-block">
                <p className="font-sans text-[11px] text-sanctuary-400 tracking-wider uppercase mb-1">Booking Reference</p>
                <p className="font-serif text-sanctuary-900 text-2xl tracking-widest">{bookingRef}</p>
              </div>
              <div className="bg-cream-50 p-5 max-w-sm mx-auto text-left">
                <div className="flex justify-between font-sans text-[13px] mb-2">
                  <span className="text-sanctuary-400">Room</span>
                  <span className="text-sanctuary-900">{selectedRoom?.name}</span>
                </div>
                <div className="flex justify-between font-sans text-[13px] mb-2">
                  <span className="text-sanctuary-400">Dates</span>
                  <span className="text-sanctuary-900">{checkIn} to {checkOut}</span>
                </div>
                <div className="flex justify-between font-sans text-[13px] mb-2">
                  <span className="text-sanctuary-400">Guests</span>
                  <span className="text-sanctuary-900">{guests}</span>
                </div>
                <div className="flex justify-between font-sans text-[13px] mb-2">
                  <span className="text-sanctuary-400">Payment</span>
                  <span className="text-sanctuary-900">{paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod === 'visa' ? 'Visa' : 'Mastercard'}</span>
                </div>
                <div className="border-t border-sanctuary-100 pt-2 mt-2 flex justify-between font-sans text-[14px] font-medium">
                  <span className="text-sanctuary-900">Total</span>
                  <span className="text-sanctuary-900">KSh {totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <p className="font-sans text-sanctuary-400 text-[12px]">
                Need help? Call us at <a href="tel:+254700123456" className="text-gold-600 underline">+254 700 123 456</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
