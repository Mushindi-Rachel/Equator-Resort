import { useState } from 'react';
import { Phone, Users, Monitor, Wifi, Coffee, Projector, Mic, Presentation } from 'lucide-react';

const spaces = [
  {
    name: 'Main Conference Hall',
    capacity: '200 delegates',
    features: ['HD projector & screen', 'Wireless microphones', 'High-speed WiFi', 'Air conditioning', 'Stage & podium'],
    rate: 'KSh 15,000 / day',
  },
  {
    name: 'Executive Boardroom',
    capacity: '20 delegates',
    features: ['75" smart display', 'Video conferencing', 'Private lounge area', 'Tea & coffee service', 'Whiteboard & flipcharts'],
    rate: 'KSh 8,000 / day',
  },
  {
    name: 'Seminar Room A',
    capacity: '50 delegates',
    features: ['Projector & screen', 'Sound system', 'Flexible seating', 'Natural daylight', 'Breakout space'],
    rate: 'KSh 6,000 / day',
  },
  {
    name: 'Seminar Room B',
    capacity: '50 delegates',
    features: ['Projector & screen', 'Sound system', 'Flexible seating', 'Natural daylight', 'Breakout space'],
    rate: 'KSh 6,000 / day',
  },
];

const amenities = [
  { icon: Wifi, label: 'High-Speed WiFi' },
  { icon: Monitor, label: 'AV Equipment' },
  { icon: Coffee, label: 'Catering' },
  { icon: Projector, label: 'Projection' },
  { icon: Mic, label: 'Sound System' },
  { icon: Presentation, label: 'Flipcharts' },
];

export default function Conferences() {
  const [activeSpace, setActiveSpace] = useState(0);

  return (
    <section id="conferences" className="py-28 bg-sanctuary-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="section-label mb-4">Conferencing</p>
          <div className="section-divider mb-6" />
          <h2 className="font-serif text-sanctuary-900 mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: '1.15' }}>
            Conference Facilities
            <br />
            <span className="text-gradient-gold">for Every Gathering</span>
          </h2>
          <p className="font-sans text-sanctuary-600 max-w-xl mx-auto leading-relaxed" style={{ fontSize: '15px' }}>
            Excellent conference facilities are available to all organizations that desire to mix business,
            team building and relaxation. State-of-the-art technology in a serene environment.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 reveal reveal-right">
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {spaces.map((space, i) => (
                <button
                  key={space.name}
                  onClick={() => setActiveSpace(i)}
                  className={`text-left p-5 transition-all duration-300 cursor-none card-luxury
                    ${activeSpace === i
                      ? 'bg-sanctuary-900 text-cream-50'
                      : 'bg-cream-50 text-sanctuary-700 hover:bg-cream-100'
                    }`}
                >
                  <h4 className={`font-serif text-[15px] mb-2 ${activeSpace === i ? 'text-gold-400' : ''}`}>
                    {space.name}
                  </h4>
                  <div className="flex items-center gap-1.5 font-sans text-[11px] opacity-70">
                    <Users size={11} />{space.capacity}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-cream-50 p-8 card-luxury">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-sanctuary-900 text-xl">{spaces[activeSpace].name}</h3>
                <span className="font-sans text-[13px] text-gold-600 font-medium">
                  {spaces[activeSpace].rate}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {spaces[activeSpace].features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 font-sans text-sanctuary-600" style={{ fontSize: '14px' }}>
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="tel:+254700123456"
                className="btn-gold inline-flex items-center gap-2"
              >
                <Phone size={14} />
                Call Now to Book
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 reveal reveal-left">
            <div className="aspect-[3/4] overflow-hidden mb-8">
              <img
                src="https://images.unsplash.com/photo-1517502884422-41e157d2c4b9?w=600&h=800&fit=crop"
                alt="Conference facilities"
                className="w-full h-full object-cover hover-scale"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {amenities.map((amenity) => {
                const Icon = amenity.icon;
                return (
                  <div key={amenity.label} className="bg-cream-50 p-4 text-center card-luxury">
                    <Icon size={20} className="text-gold-500 mx-auto mb-2" />
                    <span className="font-sans text-[10px] text-sanctuary-600 tracking-wider uppercase">
                      {amenity.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
