import { useState } from 'react';
import { Cross, Users, Heart, Baby, TreePine, Phone } from 'lucide-react';

const retreats = [
  {
    icon: Cross,
    title: 'Senior Clergy & Leadership Retreats',
    desc: 'Dedicated prayer retreats for senior clergy and church leadership seeking spiritual renewal, fasting, and deep communion with God in a serene environment.',
    guests: 'Up to 30 leaders',
    duration: '3-7 days',
  },
  {
    icon: Heart,
    title: 'Couples Retreats',
    desc: 'Strengthen your marriage through Christ-centered counseling, prayer, and quality time together in our peaceful equatorial sanctuary.',
    guests: 'Couples',
    duration: '2-4 days',
  },
  {
    icon: Baby,
    title: 'Family Retreats',
    desc: 'Bring the whole family for bonding, spiritual growth, and fun. Our unique children\'s playground ensures joyful family moments while parents find rest.',
    guests: 'Families',
    duration: '2-5 days',
  },
  {
    icon: Users,
    title: 'Youth Retreats',
    desc: 'Empower the next generation through dynamic worship, discipleship, and team-building activities designed to deepen their walk with Christ.',
    guests: 'Youth groups',
    duration: '2-4 days',
  },
  {
    icon: TreePine,
    title: 'Leadership Empowerment & Bonding',
    desc: 'Structured group retreats for team building, training, relaxation and prayer — ideal for church members to experience a strong bond with God and each other.',
    guests: 'Teams & groups',
    duration: '2-5 days',
  },
];

export default function Retreats() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = retreats[activeIdx];

  return (
    <section id="retreats" className="py-28 bg-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="section-label mb-4">Spiritual Renewal</p>
          <div className="section-divider mb-6" />
          <h2 className="font-serif text-sanctuary-900 mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: '1.15' }}>
            Retreats for Every
            <br />
            <span className="text-gradient-gold">Season of Life</span>
          </h2>
          <p className="font-sans text-sanctuary-600 max-w-xl mx-auto leading-relaxed" style={{ fontSize: '15px' }}>
            We live in a stressful world. Equator Christian Retreat steps into this space to provide
            a serene environment for spiritual therapy, emotional rejuvenation and physical wellness
            at pocket friendly rates.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-1 reveal reveal-right">
            {retreats.map((r, i) => {
              const Icon = r.icon;
              const isActive = i === activeIdx;
              return (
                <button
                  key={r.title}
                  onClick={() => setActiveIdx(i)}
                  className={`w-full text-left px-5 py-4 transition-all duration-300 flex items-center gap-3 group cursor-none
                    ${isActive ? 'bg-sanctuary-900 text-cream-50 shadow-lg' : 'hover:bg-sanctuary-50 text-sanctuary-700'}`}
                >
                  <Icon size={18} className={`transition-colors ${isActive ? 'text-gold-400' : 'text-sanctuary-400 group-hover:text-gold-500'}`} />
                  <span className="font-serif text-[15px]">{r.title}</span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 reveal reveal-left">
            <div className="bg-white card-luxury p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-sanctuary-900 flex items-center justify-center">
                  <active.icon size={22} className="text-gold-400" />
                </div>
                <div>
                  <h3 className="font-serif text-sanctuary-900 text-xl">{active.title}</h3>
                  <div className="flex gap-4 mt-1">
                    <span className="font-sans text-[11px] text-sanctuary-400 tracking-wider">
                      <Users size={11} className="inline mr-1" />{active.guests}
                    </span>
                    <span className="font-sans text-[11px] text-sanctuary-400 tracking-wider">{active.duration}</span>
                  </div>
                </div>
              </div>
              <p className="font-sans text-sanctuary-600 leading-relaxed mb-8" style={{ fontSize: '15px' }}>
                {active.desc}
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1.5 bg-sanctuary-50 text-sanctuary-600 font-sans text-[11px] tracking-wider">Pastor on Call</span>
                <span className="px-3 py-1.5 bg-sanctuary-50 text-sanctuary-600 font-sans text-[11px] tracking-wider">Counseling Available</span>
                <span className="px-3 py-1.5 bg-sanctuary-50 text-sanctuary-600 font-sans text-[11px] tracking-wider">Prayer Gardens</span>
                <span className="px-3 py-1.5 bg-sanctuary-50 text-sanctuary-600 font-sans text-[11px] tracking-wider">Children's Playground</span>
              </div>
              <a
                href="tel:+254700123456"
                className="btn-gold inline-flex items-center gap-2"
              >
                <Phone size={14} />
                Call Now to Book
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
