import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MD_BREAKPOINT = 768;

const career = [
  {
    club: 'Sporting CP',
    years: '2001 – 2003',
    image:
      'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2017/10/31145525/2017-10-31.jpg',
    color: '#00A651',
    logo: 'https://upload.wikimedia.org/wikipedia/sco/3/3e/Sporting_Clube_de_Portugal.png',
  },
  {
    club: 'Manchester United',
    years: '2003 – 2009',
    image:
      'https://s.france24.com/media/display/c254fa04-074f-11ec-b901-005056bfb2b6/w:1280/p:16x9/AP090415022483.jpg',
    color: '#DA020E',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/200px-Manchester_United_FC_crest.svg.png',
  },
  {
    club: 'Real Madrid',
    years: '2009 – 2018',
    image:
      'https://images.daznservices.com/di/library/DAZN_News/91/8c/cristiano-ronaldo-champions-league_17ak1udoiuj631316hlbv1bi1i.png?t=37193869',
    color: '#FEBE10',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/200px-Real_Madrid_CF.svg.png',
  },
  {
    club: 'Juventus',
    years: '2018 – 2021',
    image:
      'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/09/16112924/Cristiano-Ronaldo-Juventus-5.jpg',
    color: '#FFFFFF',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Juventus_FC_2017_squared_icon_%28white%29.png',
  },
  {
    club: 'Al-Nassr',
    years: '2023 –',
    image:
      'https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/2700/live/0cfb5290-6460-11ef-a7d8-61cd67f3fb31.jpg',
    color: '#FFC800',
    logo: 'https://logodownload.org/wp-content/uploads/2023/07/al-nassr-fc-logo-1.png',
  },
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MD_BREAKPOINT : false
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MD_BREAKPOINT);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const scrollDist = track.scrollWidth - window.innerWidth;
      const pinnedScroll = Math.min(scrollDist, window.innerHeight * 3.5);

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${pinnedScroll}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-zinc-950 ${
        isMobile ? 'overflow-x-auto snap-x snap-mandatory' : 'overflow-hidden'
      }`}
    >
      <div
        ref={trackRef}
        className={`flex will-change-transform ${
          isMobile ? 'h-screen' : 'h-screen'
        }`}
      >
        <div
          className={`shrink-0 h-full flex items-center justify-center px-4 ${
            isMobile ? 'w-screen snap-start' : 'w-[60vw] sm:w-[70vw] md:w-screen'
          }`}
        >
          <div className="text-center">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold">
              The <span className="text-gold-400">Journey</span>
            </h2>
            <p className="mt-6 text-white/40 tracking-[0.3em] uppercase text-xs md:text-sm">
              {isMobile ? 'Swipe to explore his legacy' : 'Scroll to explore his legacy'}
            </p>
            <div className="mt-8 flex items-center gap-2 justify-center text-white/20">
              <div className="w-12 h-px bg-white/20" />
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {career.map((item, i) => (
          <div
            key={i}
            className={`shrink-0 h-full relative ${
              isMobile ? 'w-screen snap-start' : 'w-screen'
            }`}
          >
            <img
              src={item.image}
              alt={item.club}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 md:pb-28 px-4">
              <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl px-6 md:px-10 py-5 md:py-8 text-center max-w-md">
                <img
                  src={item.logo}
                  alt={`${item.club} logo`}
                  className="w-14 h-14 md:w-18 md:h-18 object-contain mx-auto mb-4 drop-shadow-lg"
                  style={{ filter: `drop-shadow(0 0 12px ${item.color}60)` }}
                />
                <h3 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white">
                  {item.club}
                </h3>
                <p className="mt-3 text-white/50 tracking-[0.2em] text-xs md:text-sm">
                  {item.years}
                </p>
              </div>
            </div>

            <div className="absolute top-8 right-8 text-white/0.06 font-display text-8xl md:text-[10rem] font-bold leading-none pointer-events-none select-none opacity-20">
              {String(i + 1).padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
