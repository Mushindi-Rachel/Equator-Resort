import { useState } from 'react';
import { Phone, UtensilsCrossed, Clock, MapPin, ChefHat } from 'lucide-react';

const menus = [
  {
    name: 'Continental Breakfast',
    items: ['Fresh tropical fruits', 'Eggs any style', 'Freshly baked bread', 'Kenyan tea & coffee', 'Fresh juices'],
    time: '7:00 AM - 10:00 AM',
  },
  {
    name: 'Lunch Buffet',
    items: ['Seasonal salads', 'Grilled meats & fish', 'Vegetarian options', 'Local Kenyan dishes', 'Fresh desserts'],
    time: '12:30 PM - 2:30 PM',
  },
  {
    name: 'Dinner Service',
    items: ['Chef\'s special', 'Farm-to-table vegetables', 'Fresh catch of the day', 'Artisan breads', 'Decadent desserts'],
    time: '6:30 PM - 9:30 PM',
  },
];

export default function Restaurant() {
  const [activeMenu, setActiveMenu] = useState(0);

  return (
    <section id="dining" className="py-28 bg-sanctuary-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="section-label mb-4">Dining</p>
          <div className="section-divider mb-6" />
          <h2 className="font-serif text-sanctuary-900 mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: '1.15' }}>
            Nourishment for
            <br />
            <span className="text-gradient-gold">Body & Soul</span>
          </h2>
          <p className="font-sans text-sanctuary-600 max-w-xl mx-auto leading-relaxed" style={{ fontSize: '15px' }}>
            Farm-to-table dining that honors both the land and the fellowship of sharing a meal together.
            Our kitchen prepares wholesome meals to sustain you during your retreat.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal reveal-right">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-141423-9c52-eebb7541e9e?w=800&h=600&fit=crop"
                  alt="Dining"
                  className="w-full h-full object-cover hover-scale"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-sanctuary-900 p-6 card-luxury">
                <div className="flex items-center gap-3 text-gold-400 mb-2">
                  <ChefHat size={20} />
                  <span className="font-serif text-lg text-cream-50">Farm-to-Table</span>
                </div>
                <p className="font-sans text-cream-100 text-[13px] leading-relaxed">
                  Fresh, locally sourced ingredients prepared with care
                </p>
              </div>
            </div>
          </div>

          <div className="reveal reveal-left">
            <div className="flex gap-2 mb-8">
              {menus.map((menu, i) => (
                <button
                  key={menu.name}
                  onClick={() => setActiveMenu(i)}
                  className={`flex-1 py-3 px-4 font-sans text-[11px] tracking-wider uppercase transition-all duration-300 cursor-none
                    ${activeMenu === i
                      ? 'bg-sanctuary-900 text-gold-400'
                      : 'bg-sanctuary-100 text-sanctuary-600 hover:bg-sanctuary-200'
                    }`}
                >
                  {menu.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="bg-cream-50 p-8 card-luxury">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-sanctuary-900 text-xl">{menus[activeMenu].name}</h3>
                <span className="flex items-center gap-1.5 font-sans text-[11px] text-sanctuary-400">
                  <Clock size={12} />{menus[activeMenu].time}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {menus[activeMenu].items.map((item) => (
                  <li key={item} className="flex items-center gap-3 font-sans text-sanctuary-600" style={{ fontSize: '14px' }}>
                    <UtensilsCrossed size={14} className="text-gold-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 mb-6 font-sans text-[12px] text-sanctuary-400">
                <MapPin size={14} />
                <span>Main Dining Hall & Outdoor Terrace</span>
              </div>
              <a
                href="tel:+254700123456"
                className="btn-gold inline-flex items-center gap-2"
              >
                <Phone size={14} />
                Call Now to Book Dining
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
