import { useState } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  { id: 1, src: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Equator Landscape', category: 'Nature' },
  { id: 2, src: 'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Garden View', category: 'Grounds' },
  { id: 3, src: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Retreat Room', category: 'Rooms' },
  { id: 4, src: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Dining', category: 'Dining' },
  { id: 5, src: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Suite Interior', category: 'Rooms' },
  { id: 6, src: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Prayer Garden', category: 'Spiritual' },
];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => (i !== null ? (i - 1 + images.length) % images.length : null));
  const nextImage = () => setLightboxIndex(i => (i !== null ? (i + 1) % images.length : null));

  return (
    <section id="gallery" className="py-28 bg-sanctuary-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <p className="section-label text-gold-400 mb-4">Visual Stories</p>
          <h2 className="font-serif text-cream-50" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
            Retreat <span className="text-gradient-gold">Gallery</span>
          </h2>
        </div>

        <div className="gallery-grid">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="group relative overflow-hidden cursor-none"
              onClick={() => openLightbox(i)}
            >
              <div className="overflow-hidden aspect-square">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-sanctuary-900/0 group-hover:bg-sanctuary-900/50 transition-all duration-400 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-400">
                  <ZoomIn size={24} className="text-cream-50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-cream-200/30 flex items-center justify-center text-cream-50 hover:border-gold-400 hover:text-gold-400 transition-colors cursor-none z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] mx-auto px-14" onClick={e => e.stopPropagation()}>
            <img
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              className="max-w-full max-h-[82vh] object-contain"
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-cream-200/30 flex items-center justify-center text-cream-50 hover:border-gold-400 hover:text-gold-400 transition-colors cursor-none z-10"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-10 h-10 border border-cream-200/30 flex items-center justify-center text-cream-50 hover:border-gold-400 hover:text-gold-400 transition-colors cursor-none"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
