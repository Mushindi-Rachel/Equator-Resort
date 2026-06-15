import { Sparkles, Wind, Zap } from 'lucide-react';

const experiences = [
  {
    name: 'The Electromagnetic Pulse',
    description: 'Situated uniquely on the Equator, experience the natural electromagnetic pulse that recharges your body systems. A phenomenon found only at Latitude Zero.',
    icon: Zap,
  },
  {
    name: 'Equator Meditation Garden',
    description: 'A dedicated outdoor space precisely on the Equator line for meditation and prayer. Feel the unique energy as you stand between two hemispheres.',
    icon: Wind,
  },
  {
    name: 'Latitude Zero Sunset',
    description: 'Witness the extraordinary near-equal day and night cycle. The equatorial sunset is a daily reminder of God\'s perfect design and rhythm of creation.',
    icon: Sparkles,
  },
];

export default function LatitudeZero() {
  return (
    <section id="latitude-zero" className="overflow-hidden">
      <div className="relative h-[60vh] min-h-[450px] overflow-hidden">
        <img src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Equator landscape" className="w-full h-full object-cover animate-ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sanctuary-900/30 to-sanctuary-900/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center reveal">
            <p className="section-label text-gold-400 mb-4">Only at the Equator</p>
            <h2 className="font-serif text-cream-50" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: '1.1' }}>
              Latitude Zero
              <br />
              <span className="text-gradient-gold">Experience</span>
            </h2>
            <p className="font-sans text-cream-200/80 max-w-lg mx-auto mt-4 text-[14px] leading-relaxed">
              You will definitely enjoy the Latitude Zero Experience as you connect
              with the unique electromagnetic pulse that recharges your body systems.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-cream-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <p className="section-label mb-3">Unique to This Place</p>
            <h3 className="font-serif text-sanctuary-900" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
              What Makes <span className="text-gradient-gold">Latitude Zero</span> Special
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {experiences.map((exp) => {
              const Icon = exp.icon;
              return (
                <div key={exp.name} className="reveal bg-white card-luxury p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 border border-gold-500/40 flex items-center justify-center">
                    <Icon size={28} className="text-gold-500" />
                  </div>
                  <h4 className="font-serif text-sanctuary-900 text-xl mb-4">{exp.name}</h4>
                  <p className="font-sans text-sanctuary-600 text-[14px] leading-relaxed">{exp.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-16 reveal">
            <div className="bg-sanctuary-900 p-10 max-w-2xl mx-auto">
              <p className="font-serif text-cream-50 text-xl mb-4 italic">
                &ldquo;Standing at the Equator, you stand at the centre of the Earth &mdash;
                the perfect place to centre your spirit in God.&rdquo;
              </p>
              <p className="font-sans text-gold-400 text-[12px] tracking-widest uppercase">
                The Latitude Zero Experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
