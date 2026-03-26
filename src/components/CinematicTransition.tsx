import { motion } from 'motion/react';

const textBlocks = [
  {
    type: 'eyebrow' as const,
    text: 'More Than a Player',
  },
  {
    type: 'title' as const,
    text: 'A Legacy Written in Gold',
  },
  {
    type: 'body' as const,
    text: '900+ goals. 5 Ballon d\'Or. 5 Champions League titles. Numbers that define greatness — but never the full story.',
  },
  {
    type: 'body' as const,
    text: 'From Madeira to Manchester, from Madrid to the world — every chapter forged with obsession, sacrifice, and an unbreakable will to be the best.',
  },
];

const textVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  },
};

export default function CinematicTransition() {
  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center px-6 md:px-12 py-24">
      <div className="max-w-3xl w-full flex flex-col items-center text-center gap-6">
        {textBlocks.map((block, i) => (
          <motion.div
            key={i}
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.9,
              delay: 0.15 + i * 0.22,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {block.type === 'eyebrow' && (
              <p
                className="tracking-[0.35em] uppercase text-xs md:text-sm font-medium"
                style={{
                  color: 'rgba(212,175,55,0.8)',
                  textShadow: '0 0 30px rgba(212,175,55,0.3)',
                }}
              >
                {block.text}
              </p>
            )}

            {block.type === 'title' && (
              <h2
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                style={{
                  color: '#fff',
                  textShadow:
                    '0 0 60px rgba(212,175,55,0.15), 0 2px 20px rgba(0,0,0,0.6)',
                }}
              >
                {block.text}
              </h2>
            )}

            {block.type === 'body' && (
              <p
                className="text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl"
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  textShadow: '0 1px 12px rgba(0,0,0,0.5)',
                }}
              >
                {block.text}
              </p>
            )}
          </motion.div>
        ))}

        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: 1,
            delay: 0.15 + textBlocks.length * 0.22,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="mt-4"
        >
          <div
            className="h-px w-24 mx-auto"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)',
            }}
          />
        </motion.div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 55%, rgba(212,175,55,0.04) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
