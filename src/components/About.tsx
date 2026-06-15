import { useRef } from 'react';
import * as React from 'react';
import { Leaf, Heart, Users, Clock } from 'lucide-react';
import { useRevealOnSection } from '../hooks/useScrollReveal';
import { useCounter } from '../hooks/useCounter';

const stats = [
  { value: 45, suffix: '+', label: 'Ensuite Rooms', icon: Leaf },
  { value: 500, suffix: '+', label: 'Acres of Serenity', icon: Heart },
  { value: 12, suffix: 'K+', label: 'Lives Touched', icon: Users },
  { value: 15, suffix: 'yrs', label: 'of Ministry', icon: Clock },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [statsVisible, setStatsVisible] = React.useState(false);
  useRevealOnSection(sectionRef);

  const handleStatsInView = () => setStatsVisible(true);

  return (
    <section ref={sectionRef} id="about" className="py-28 bg-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="section-label mb-4">Our Story</p>
          <div className="section-divider mb-6" />
          <h2 className="font-serif text-sanctuary-900 mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: '1.15' }}>
            Where Serenity Meets
            <br />
            <span className="text-gradient-gold">Spiritual Renewal</span>
          </h2>
          <p className="font-sans text-sanctuary-700 max-w-2xl mx-auto leading-relaxed" style={{ fontSize: '15px' }}>
            Nestled uniquely on the Equator, our retreat centre is a sanctuary where the beauty of
            God's creation harmonizes with spiritual therapy, emotional rejuvenation and physical
            wellness &mdash; at pocket-friendly rates.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="reveal reveal-right">
            <div className="relative">
              <div className="img-overlay rounded-none overflow-hidden aspect-[4/5]">
                <img
                  src="https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Retreat grounds"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-sanctuary-900 text-cream-50 p-6 w-52 shadow-sanctuary hidden md:block">
                <div className="section-label text-gold-400 mb-2" style={{ fontSize: '9px' }}>
                  Est. 2009
                </div>
                <div className="font-display text-cream-50" style={{ fontSize: '1.4rem', lineHeight: '1.3' }}>
                  15 Years of
                  <br />
                  <span className="text-gold-400">Ministry</span>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-gold-500 opacity-40 hidden md:block" />
            </div>
          </div>

          <div className="reveal reveal-left">
            <p className="section-label mb-4">About Equator Christian Retreat</p>
            <div className="section-divider-left mb-8" />
            <h3 className="font-serif text-sanctuary-900 mb-6" style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', lineHeight: '1.25' }}>
              Healing Support for
              <br />Spirit, Soul & Body
            </h3>
            <p className="font-sans text-sanctuary-600 leading-relaxed mb-5" style={{ fontSize: '15px' }}>
              We live in a stressful world today. Few people can really afford an expensive holiday
              to wind down and rest. Many who live in city environments have limited spaces for
              an outing with the family. Equator Christian Retreat endeavours to step into this
              space to provide a serene environment for spiritual therapy, emotional rejuvenation
              and physical wellness.
            </p>
            <p className="font-sans text-sanctuary-600 leading-relaxed mb-8" style={{ fontSize: '15px' }}>
              The centre has the requisite serenity and is uniquely situated on the Equator &mdash;
              ideal for relaxation, meditation and connecting with God. The ambience is excellent,
              homely and welcoming. Counselling and other spiritual ministration services are
              offered on demand, with a pastor available on call.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {['Prayer & Fasting Retreats', 'Family Bonding Playground', 'Counselling On Demand', 'Latitude Zero Experience'].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                  <span className="font-sans text-sanctuary-700 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => document.querySelector('#retreats')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-outline-gold"
            >
              Explore Our Retreats
            </button>
          </div>
        </div>

        <div className="reveal" style={{ borderTop: '1px solid rgba(212, 148, 58, 0.2)', borderBottom: '1px solid rgba(212, 148, 58, 0.2)' }}>
          <div
            className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8"
            onMouseEnter={handleStatsInView}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              const count = useCounter(stat.value, 2000, statsVisible);
              return (
                <div key={stat.label} className="flex flex-col items-center text-center">
                  <Icon size={20} className="text-gold-500 mb-3 opacity-80" />
                  <div className="stat-number text-sanctuary-900" style={{ fontSize: '3rem' }}>
                    {count}{stat.suffix}
                  </div>
                  <div className="section-label mt-1" style={{ fontSize: '10px' }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
