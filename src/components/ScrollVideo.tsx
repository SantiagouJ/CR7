import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 30;
const FRAME_PATH = '/ronaldo/';

const STORY_BLOCKS = [
  {
    headline: 'Born to\nConquer',
    body: 'From the streets of Funchal to the biggest stages in world football — a boy with nothing but a dream and relentless hunger.',
    accent: 'text-gold-400',
  },
  {
    headline: 'The\nPhenomenon',
    body: '5 Ballon d\'Or. 5 Champions League titles. 900+ career goals. Numbers that define an era, a legacy that rewrote the history of the sport.',
    accent: 'text-gold-300',
  },
  {
    headline: 'Mentality\nMonster',
    body: 'When the lights shine brightest, he rises. Hat-tricks in finals, last-minute winners, performances that bend the laws of what\'s humanly possible.',
    accent: 'text-gold-200',
  },
  {
    headline: 'Forever\nCR7',
    body: 'More than a player. An institution. A standard. The name that echoes through every stadium, every generation, every corner of the world.',
    accent: 'text-gold-400',
  },
];

function padFrame(n: number): string {
  return String(n).padStart(5, '0');
}

export default function ScrollVideo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const frameIndex = useRef(1);
  const images = useRef<HTMLImageElement[]>([]);
  const loadedCount = useRef(0);

  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const stickyRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = images.current[index - 1];
    if (!img || !img.complete) return;

    const rect = wrap.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const scale = Math.max(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight
    );
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, w, h);
  }, []);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `${FRAME_PATH}${padFrame(i)}.png`;
      img.onload = () => {
        loadedCount.current++;
        if (loadedCount.current >= TOTAL_FRAMES) {
          setLoaded(true);
          drawFrame(1);
        }
      };
      imgs.push(img);
    }
    images.current = imgs;
  }, [drawFrame]);

  useEffect(() => {
    if (!loaded) return;

    const ctx = gsap.context(() => {
      const obj = { frame: 1 };

      gsap.to(obj, {
        frame: TOTAL_FRAMES,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => setProgress(self.progress),
        },
        onUpdate: () => {
          const f = Math.round(obj.frame);
          if (f !== frameIndex.current) {
            frameIndex.current = f;
            drawFrame(f);
          }
        },
      });

      // Section fade-in from black
      gsap.fromTo(
        stickyRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'power1.in',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 40%',
            end: '8% top',
            scrub: true,
          },
        }
      );

      // Intro fade-out
      gsap.to(introRef.current, {
        opacity: 0,
        y: -80,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '12% top',
          scrub: true,
        },
      });

      // Right panel fade-in
      gsap.fromTo(
        panelRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '8% top',
            end: '18% top',
            scrub: true,
          },
        }
      );

      // Story blocks — staggered reveal
      const blockCount = STORY_BLOCKS.length;
      const scrollStart = 0.15;
      const scrollEnd = 0.85;
      const range = scrollEnd - scrollStart;
      const blockDuration = range / blockCount;

      storyRefs.current.forEach((el, i) => {
        if (!el) return;

        const enterStart = scrollStart + i * blockDuration;
        const enterEnd = enterStart + blockDuration * 0.3;
        const exitStart = enterStart + blockDuration * 0.7;
        const exitEnd = enterStart + blockDuration;

        const toPercent = (v: number) => `${Math.round(v * 100)}%`;

        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `${toPercent(enterStart)} top`,
              end: `${toPercent(enterEnd)} top`,
              scrub: true,
            },
          }
        );

        if (i < blockCount - 1) {
          gsap.to(el, {
            opacity: 0,
            y: -40,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `${toPercent(exitStart)} top`,
              end: `${toPercent(exitEnd)} top`,
              scrub: true,
            },
          });
        }
      });

      // Last block holds and fades at very end
      const lastEl = storyRefs.current[blockCount - 1];
      if (lastEl) {
        gsap.to(lastEl, {
          opacity: 0,
          y: -30,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '93% top',
            end: '99% top',
            scrub: true,
          },
        });
      }

      // Panel fade-out at end
      gsap.to(panelRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '95% top',
          end: '100% top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loaded, drawFrame]);

  useEffect(() => {
    const handleResize = () => {
      if (loaded) drawFrame(frameIndex.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loaded, drawFrame]);

  const loadPercent = loaded
    ? 100
    : Math.round((loadedCount.current / TOTAL_FRAMES) * 100);

  return (
    <div ref={sectionRef} className="relative h-[400vh] bg-black">
      {!loaded && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-6">
          <div className="relative w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gold-400 rounded-full transition-all duration-300"
              style={{ width: `${loadPercent}%` }}
            />
          </div>
          <p className="text-white/40 text-sm tracking-[0.3em] uppercase font-light">
            Loading experience — {loadPercent}%
          </p>
        </div>
      )}

      {/* Sticky viewport */}
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden" style={{ opacity: 0}}>
        {/* Canvas — full bleed behind everything */}
        <div ref={canvasWrapRef} className="absolute inset-0">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Cinematic vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* Top / bottom gradients */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black/70 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-black/80 to-transparent pointer-events-none" />

        {/* ─── Right narrative panel ─── */}
        <div
          ref={panelRef}
          className="absolute top-0 right-0 h-full w-full md:w-[42%] pointer-events-none z-10 opacity-0"
        >
          {/* Blurred dark backdrop */}
          <div className="absolute inset-0 backdrop-blur-md bg-black/60" />

          {/* Gradient blending edge into the video */}
          <div
            className="absolute inset-y-0 -left-24 w-24 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(0,0,0,0.50))',
            }}
          />

          {/* Subtle inner border */}
          <div className="absolute inset-y-0 left-0 w-px bg-white/6" />

          {/* Story blocks — absolutely positioned, stacked */}
          <div className="relative h-full flex items-center justify-center px-8 md:px-12 lg:px-16">
            {STORY_BLOCKS.map((block, i) => (
              <div
                key={i}
                ref={(el) => { storyRefs.current[i] = el; }}
                className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 lg:px-16 opacity-0 will-change-transform"
              >
                {/* Decorative accent line */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-gold-400/60" />
                  <span className="text-gold-400/50 text-[10px] tracking-[0.5em] uppercase font-light">
                    {String(i + 1).padStart(2, '0')} / {String(STORY_BLOCKS.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Headline */}
                <h2
                  className={`font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-tight whitespace-pre-line ${block.accent}`}
                >
                  {block.headline}
                </h2>

                {/* Divider */}
                <div className="mt-6 mb-5 w-12 h-[2px] bg-gold-400/30 rounded-full" />

                {/* Body text */}
                <p className="text-white/70 text-base lg:text-lg leading-relaxed max-w-md font-light">
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Intro overlay (centered, fades first) ─── */}
        <div
          ref={introRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none z-20"
        >
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
            <span className="text-white">CR7</span>{' '}
            <span className="text-gold-400 italic">Legacy</span>
          </h2>
          <p className="mt-6 text-white/50 tracking-[0.25em] uppercase text-xs md:text-sm font-light">
            A career beyond greatness
          </p>
          <div className="mt-12 flex flex-col items-center gap-3 text-white/30">
            <div className="w-px h-10 bg-linear-to-b from-transparent via-white/20 to-white/40 animate-pulse" />
            <span className="text-[10px] tracking-[0.4em] uppercase">
              Scroll to experience
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-30">
          <div
            className="h-full bg-gold-400/60 transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Frame counter */}
        <div className="absolute top-6 left-6 z-30 pointer-events-none">
          <span className="text-white/15 font-mono text-xs tabular-nums">
            {String(frameIndex.current).padStart(3, '0')} / {TOTAL_FRAMES}
          </span>
        </div>
      </div>
    </div>
  );
}
