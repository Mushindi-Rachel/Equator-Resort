import { Calendar, Clock, ArrowRight } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'Finding Peace at the Equator: A Spiritual Journey',
    category: 'Testimonies',
    date: 'May 28, 2025',
    readTime: '6 min',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    id: 2,
    title: 'The Power of Corporate Prayer in Retreat',
    category: 'Spiritual Growth',
    date: 'May 14, 2025',
    readTime: '4 min',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    title: 'Why Your Church Needs a Leadership Retreat',
    category: 'Leadership',
    date: 'April 30, 2025',
    readTime: '8 min',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function Blog() {
  const [featured, ...rest] = posts;

  return (
    <section id="blog" className="py-28 bg-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 reveal">
          <div>
            <p className="section-label mb-4">Stories & Insights</p>
            <h2 className="font-serif text-sanctuary-900" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              From Our <span className="text-gradient-gold">Journal</span>
            </h2>
          </div>
          <button className="btn-outline-gold self-start md:self-auto">
            View All Articles
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 reveal reveal-right">
            <div className="card-luxury bg-white h-full group overflow-hidden">
              <div className="img-overlay aspect-[16/9] overflow-hidden">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <p className="blog-card-tag mb-3">{featured.category}</p>
                <h3 className="font-serif text-sanctuary-900 mb-4 group-hover:text-sanctuary-700 transition-colors" style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)' }}>
                  {featured.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sanctuary-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span className="font-sans text-[12px]">{featured.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <span className="font-sans text-[12px]">{featured.readTime}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-gold-500 hover:text-gold-600 transition-colors cursor-none">
                    <span className="font-sans text-[12px] font-semibold tracking-wider uppercase">Read More</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {rest.map((post) => (
              <div key={post.id} className="reveal card-luxury bg-white flex gap-4 overflow-hidden group">
                <div className="img-overlay w-28 flex-shrink-0 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <p className="blog-card-tag mb-2">{post.category}</p>
                    <h4 className="font-serif text-sanctuary-900 text-[14px] leading-snug group-hover:text-sanctuary-700 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sanctuary-400">
                      <Clock size={10} />
                      <span className="font-sans text-[11px]">{post.readTime}</span>
                    </div>
                    <ArrowRight size={14} className="text-gold-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
