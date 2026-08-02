"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative min-h-[65vh] flex flex-col justify-center px-6 overflow-hidden pt-32 pb-10">
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl opacity-60 -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[var(--accent-light)]/5 rounded-full blur-3xl opacity-40 -z-10" />

      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-[var(--accent)] font-bold tracking-widest uppercase text-xs mb-6">Available for Projects</p>
          <div className="flex justify-between items-center gap-8">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-[var(--foreground)]">
              SAIF ALI <br /> WAJID
            </h1>
            {imgError ? (
              <div className="w-36 h-36 md:w-52 md:h-52 rounded-full object-cover border-4 border-[var(--accent)]/20 shrink-0 flex items-center justify-center bg-[var(--surface)] text-3xl md:text-4xl font-bold text-[var(--muted)]">SW</div>
            ) : (
              <img
                src="https://avatars.githubusercontent.com/u/191212278?v=4"
                alt="Saif Ali Wajid"
                className="w-36 h-36 md:w-52 md:h-52 rounded-full object-cover border-4 border-[var(--accent)]/20 shrink-0"
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <p className="text-2xl md:text-3xl text-gray-400 dark:text-gray-500 max-w-2xl font-light leading-snug">
            Professional <span className="text-[var(--foreground)] font-normal italic">Full-Stack Developer</span> crafting high-performance web solutions.
          </p>
        </motion.div>
      </div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-300 dark:text-gray-700 hidden md:block"
      >
        <a href="#about" aria-label="Scroll to About section" className="block">
          <ChevronDown size={32} />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
