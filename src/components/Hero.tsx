import { useEffect, useState, useRef } from 'react';
import { ChevronDown, MapPin, Volume2, VolumeX } from 'lucide-react';

interface HeroProps {
  onBookNow: () => void;
}

export default function Hero({ onBookNow }: HeroProps) {
  const [loaded, setLoaded] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden" id="home">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
        style={{ animation: 'kenBurns 20s ease-in-out infinite alternate' }}
        onCanPlay={() => setLoaded(true)}
      >
        <source
          src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-sanctuary-950 via-sanctuary-900 to-sanctuary-900" />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-sanctuary-950/50 via-sanctuary-900/60 to-sanctuary-900/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-sanctuary-950/35 to-transparent" />

      <button
        onClick={toggleMute}
        className="absolute top-24 right-6 z-20 w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-sm text-cream-50 hover:text-gold-400 hover:bg-black/50 transition-all cursor-none rounded-full"
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 z-10">
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent to-gold-500 opacity-60" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold-500 opacity-60" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div className={`transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="ornament mb-6">
            <span className="section-label text-gold-400">Welcome to</span>
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="hero-title text-cream-50 mb-4" style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}>
            Equator
          </h1>
          <h2 className="hero-subtitle text-gold-300 mb-2" style={{ fontSize: 'clamp(1.2rem, 2.8vw, 2.2rem)', fontWeight: 400 }}>
            Christian Retreat & Conference Centre
          </h2>
        </div>

        <div className={`transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}>
          <div className="flex items-center gap-4 my-6">
            <div className="w-16 h-[1px] bg-gold-500 opacity-60" />
            <span className="font-serif text-gold-400 text-lg italic">Spirit &middot; Soul &middot; Body</span>
            <div className="w-16 h-[1px] bg-gold-500 opacity-60" />
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-900 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="font-sans text-cream-100 opacity-90 max-w-xl mx-auto mb-10" style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)', lineHeight: '1.8', letterSpacing: '0.04em' }}>
            A serene sanctuary at the Equator for spiritual therapy,
            emotional rejuvenation and physical wellness at pocket friendly rates.
            <br />
            Healing support for the total person — Spirit, Soul and Body.
          </p>
        </div>

        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-[1100ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <button onClick={onBookNow} className="btn-gold">
            Book Your Retreat
          </button>
          <button
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline-white"
          >
            Discover the Centre
          </button>
        </div>

        <div className={`absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-all duration-1000 delay-[1300ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <MapPin size={13} className="text-gold-400" />
          <span className="font-sans text-cream-200 text-[12px] tracking-widest uppercase opacity-80">
            Latitude 0&deg; &mdash; The Equator
          </span>
        </div>

        <button
          onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-200 transition-all duration-1000 delay-[1500ms] cursor-none ${loaded ? 'opacity-60' : 'opacity-0'} hover:opacity-100`}
        >
          <span className="font-sans text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
