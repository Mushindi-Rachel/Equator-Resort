import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-28 bg-sanctuary-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <p className="section-label text-gold-400 mb-4">Get in Touch</p>
          <h2 className="font-serif text-cream-50" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
            Plan Your <span className="text-gradient-gold">Retreat</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 reveal reveal-right">
            <div className="space-y-8">
              {[
                { icon: MapPin, label: 'Location', value: 'The Equator, Kenya' },
                { icon: Phone, label: 'Phone', value: '+254 700 123 456' },
                { icon: Mail, label: 'Email', value: 'retreat@equatorchristian.org' },
                { icon: Clock, label: 'Check-in', value: '2:00 PM' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-gold-500/40 flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon size={15} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="font-sans text-[11px] text-gold-500 tracking-widest uppercase mb-1">{label}</p>
                    <p className="font-serif text-cream-100">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 reveal reveal-left">
            <div className="border border-gold-500/20 p-8" style={{ background: 'rgba(250,250,245,0.04)' }}>
              {sent ? (
                <div className="flex flex-col items-center justify-center text-center py-16 gap-6">
                  <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-serif text-cream-50 text-2xl mb-3">Message Received</h3>
                    <p className="font-sans text-cream-300/70 text-[14px]">
                      Thank you for reaching out. We'll respond within 2 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setSent(false)}
                    className="btn-outline-gold mt-2"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-serif text-cream-50 text-xl mb-2">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <input
                        required
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="input-luxury-dark"
                      />
                      <input
                        required
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="input-luxury-dark"
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="input-luxury-dark"
                    />
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your retreat needs..."
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="input-luxury-dark resize-none"
                    />
                    <button type="submit" className="btn-gold w-full justify-center gap-3">
                      <Send size={14} />
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
