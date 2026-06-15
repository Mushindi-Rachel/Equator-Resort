import { useEffect, useRef, useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Retreats from './components/Retreats';
import Rooms from './components/Rooms';
import Restaurant from './components/Restaurant';
import Conferences from './components/Conferences';
import LatitudeZero from './components/LatitudeZero';
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import Contact from './components/Contact';
import BookNow from './components/BookNow';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { useScrollReveal } from './hooks/useScrollReveal';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function App() {
  const [bookNowOpen, setBookNowOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);

  useScrollReveal();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => { await checkAdmin(session.user.id); })();
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .maybeSingle();
    setIsAdmin(data?.is_admin === true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const outline = cursorOutlineRef.current;
    if (!dot || !outline) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const animateOutline = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      outline.style.left = `${outlineX}px`;
      outline.style.top = `${outlineY}px`;
      animId = requestAnimationFrame(animateOutline);
    };

    const handleMouseEnterInteractive = () => outline.classList.add('cursor-hover');
    const handleMouseLeaveInteractive = () => outline.classList.remove('cursor-hover');

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(animateOutline);

    const attachListeners = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive);
        el.addEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };

    attachListeners();
    const mutationObserver = new MutationObserver(attachListeners);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      mutationObserver.disconnect();
    };
  }, []);

  const anyModalOpen = bookNowOpen || authOpen || adminOpen;
  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [anyModalOpen]);

  const openBookNow = () => {
    setBookNowOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    if (isAdmin) setAdminOpen(true);
  };

  const handleAdminOpen = () => {
    if (isAdmin) {
      setAdminOpen(true);
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <div ref={cursorDotRef} className="cursor-dot" />
      <div ref={cursorOutlineRef} className="cursor-outline" />

      <Navigation
        onBookNow={openBookNow}
        user={user}
        isAdmin={isAdmin}
        onAdminOpen={handleAdminOpen}
        onSignOut={async () => { await supabase.auth.signOut(); }}
        onSignIn={() => setAuthOpen(true)}
      />

      <main>
        <Hero onBookNow={openBookNow} />
        <About />
        <Retreats />
        <Rooms onBookNow={openBookNow} />
        <Restaurant />
        <Conferences />
        <LatitudeZero />
        <Gallery />
        <Blog />
        <Contact />
      </main>

      <Footer onBookNow={openBookNow} />

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {bookNowOpen && (
        <BookNow onClose={() => setBookNowOpen(false)} />
      )}

      {adminOpen && user && isAdmin && (
        <AdminDashboard
          onClose={() => setAdminOpen(false)}
          adminUser={{ id: user.id, email: user.email || '' }}
        />
      )}
    </>
  );
}
