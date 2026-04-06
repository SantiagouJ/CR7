import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  'I', "don't", 'have', 'to', 'show',
  'anything', 'to', 'anyone.',
  'There', 'is', 'nothing', 'to', 'prove.',
];

const BREAK_AFTER = 7; // line break after "anyone."

export default function QuoteTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          scrub: 0.4,
        },
      });

      // Glow pulse in
      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
        0
      );

      // Decorative line scales in
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.3, ease: 'power2.out' },
        0
      );

      // Words reveal one by one
      wordsRef.current.forEach((word, i) => {
        if (!word) return;
        tl.fromTo(
          word,
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.15,
            ease: 'power3.out',
          },
          0.15 + i * 0.06
        );
      });

      // Author attribution fade in
      tl.fromTo(
        authorRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        '>-0.1'
      );

      // Hold for a beat, then fade everything out
      tl.to({}, { duration: 0.3 });

      tl.to(
        [...wordsRef.current.filter(Boolean), authorRef.current, lineRef.current, glowRef.current],
        {
          opacity: 0,
          y: -20,
          scale: 0.97,
          duration: 0.3,
          stagger: 0.01,
          ease: 'power2.in',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-black overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-0"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Top decorative line */}
        <div
          ref={lineRef}
          className="w-16 h-px bg-gold-400/40 mb-10 origin-center"
          style={{ transform: 'scaleX(0)' }}
        />

        {/* Quote */}
        <blockquote className="text-center max-w-3xl">
          <p className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            {WORDS.map((word, i) => (
              <span key={i}>
                {i === BREAK_AFTER && (
                  <br className="hidden sm:block" />
                )}
                <span
                  ref={(el) => { wordsRef.current[i] = el; }}
                  className="inline-block text-white/90 will-change-transform mr-[0.25em]"
                  style={{ opacity: 0 }}
                >
                  {word}
                </span>
              </span>
            ))}
          </p>
        </blockquote>

        {/* Author */}
        <p
          ref={authorRef}
          className="mt-10 text-gold-400/60 tracking-[0.4em] uppercase text-[11px] font-light opacity-0"
        >
          — Cristiano Ronaldo
        </p>
      </div>

      {/* Edge gradients for seamless blending */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-zinc-950 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
