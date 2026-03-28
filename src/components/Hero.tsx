import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE =
  'https://st1.uvnimg.com/55/97/5dce63704f2b8754e491d0adac09/20170628-5261.jpg';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        scale: 1.3,
        y: 150,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      <img
        ref={imageRef}
        src={HERO_IMAGE}
        alt="Cristiano Ronaldo"
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-zinc-950" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 80, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none">
            CRISTIANO
            <br />
            <span className="text-gold-400 italic">RONALDO</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-8 text-base md:text-lg tracking-[0.3em] uppercase text-white/60 font-light"
        >
          The Greatest of All Time
        </motion.p>

        
      </div>
    </section>
  );
}
