import { Eye } from 'lucide-react';

const rooms = [
  { id: 1, name: 'Standard Room', price: 150, size: '35 m\u00B2', image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Standard', badge: '' },
  { id: 2, name: 'Deluxe Room', price: 280, size: '55 m\u00B2', image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Deluxe', badge: 'Popular' },
  { id: 3, name: 'Executive Suite', price: 520, size: '90 m\u00B2', image: 'https://images.pexels.com/photos/3201763/pexels-photo-3201763.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Suite', badge: 'Signature' },
  { id: 4, name: 'Family Room', price: 380, size: '75 m\u00B2', image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Family', badge: 'Family Pick' },
  { id: 5, name: 'Pastoral Suite', price: 1200, size: '200 m\u00B2', image: 'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Suite', badge: 'Clergy' },
  { id: 6, name: 'Garden Suite', price: 820, size: '110 m\u00B2', image: 'https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Suite', badge: 'Meditation' },
];

interface RoomsProps {
  onBookNow: () => void;
}

export default function Rooms({ onBookNow }: RoomsProps) {
  return (
    <section id="rooms" className="py-28 bg-sanctuary-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="section-label mb-4">Accommodations</p>
          <div className="section-divider mb-6" />
          <h2 className="font-serif text-sanctuary-900 mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: '1.15' }}>
            Rooms &amp; <span className="text-gradient-gold">Suites</span>
          </h2>
          <p className="font-sans text-sanctuary-600 max-w-xl mx-auto leading-relaxed" style={{ fontSize: '15px' }}>
            Excellent accommodation fitted with state-of-the-art ensuite facilities,
            free WiFi and Smart TV. Ideal for quiet reflection, fasting and prayer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="reveal reveal-scale bg-white card-luxury group">
              <div className="img-overlay aspect-[4/3] overflow-hidden relative">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                {room.badge && (
                  <div className="absolute top-4 left-4 z-20 bg-gold-500 text-sanctuary-900 px-3 py-1">
                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase">{room.badge}</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="section-label mb-1" style={{ fontSize: '10px' }}>{room.category} &middot; {room.size}</p>
                    <h3 className="font-serif text-sanctuary-900 text-xl">{room.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-[11px] text-sanctuary-400 uppercase tracking-wider">from</p>
                    <p className="font-display text-sanctuary-900 text-2xl">${room.price}</p>
                    <p className="font-sans text-[11px] text-sanctuary-400">/night</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Eye size={12} className="text-gold-500" />
                  <span className="font-sans text-[12px] text-sanctuary-500">Serene View</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {['Free WiFi', 'Smart TV', 'Breakfast Included', 'Hot Shower', 'Room Service'].map(a => (
                    <span key={a} className="bg-sanctuary-50 text-sanctuary-600 font-sans text-[10px] px-2 py-0.5">&#10003; {a}</span>
                  ))}
                </div>

                <button onClick={onBookNow} className="btn-gold w-full justify-center text-[11px] py-3">
                  Reserve This Room
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
