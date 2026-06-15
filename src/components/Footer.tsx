import { ArrowUp, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onBookNow: () => void;
}

const footerLinks = {
  'Explore': [
    { label: 'About Us', href: '#about' },
    { label: 'Retreats', href: '#retreats' },
    { label: 'Rooms', href: '#rooms' },
    { label: 'Dining', href: '#dining' },
    { label: 'Conferences', href: '#conferences' },
  ],
  'Discover': [
    { label: 'Latitude Zero', href: '#latitude-zero' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ],
};

export default function Footer({ onBookNow }: FooterProps) {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-sanctuary-950 text-cream-50">
      <div className="relative overflow-hidden py-20 px-6" style={{ background: 'linear-gradient(135deg, #0d2118 0%, #1a3a2a 100%)' }}>
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="section-label text-gold-400 mb-5">Begin Your Journey</p>
          <h2 className="font-serif text-cream-50 mb-6" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            Experience the Peace of
            <br />
            <span className="text-gradient-gold">Equator Christian Retreat</span>
          </h2>
          <p className="font-sans text-cream-200/70 text-[14px] mb-8">
            Book your retreat for spiritual therapy, emotional rejuvenation and physical wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onBookNow} className="btn-gold">
              Book Your Retreat
            </button>
            <button onClick={() => navClick('#contact')} className="btn-outline-white">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <p className="font-display text-cream-50 text-xl tracking-[0.22em] uppercase mb-1">Equator</p>
              <p className="section-label text-gold-500" style={{ fontSize: '9px' }}>Christian Retreat & Conference Centre</p>
            </div>
            <p className="font-sans text-cream-200/60 text-[13px] leading-relaxed mb-6 max-w-xs">
              A serene sanctuary on the Equator for spiritual therapy, emotional rejuvenation
              and physical wellness. Healing support for the total person &mdash; Spirit, Soul & Body.
            </p>

            <div className="space-y-3">
              {[
                { icon: MapPin, text: 'The Equator, Kenya' },
                { icon: Phone, text: '+254 700 123 456' },
                { icon: Mail, text: 'retreat@equatorchristian.org' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={13} className="text-gold-500" />
                  <span className="footer-link text-[13px]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-sans text-[11px] font-semibold text-cream-50 tracking-[0.2em] uppercase mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <button onClick={() => navClick(href)} className="footer-link cursor-none">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-cream-200/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[12px] text-cream-200/40">
            &copy; {new Date().getFullYear()} Equator Christian Retreat & Conference Centre. All rights reserved.
          </p>
          <button
            onClick={scrollTop}
            className="w-9 h-9 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-sanctuary-900 transition-all duration-300 cursor-none"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
