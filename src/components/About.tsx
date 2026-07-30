"use client";

import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent)] mb-6">Expertise</h2>
          <p className="text-3xl md:text-5xl font-light leading-tight tracking-tight text-[var(--muted)]">
            I am a <span className="font-bold text-[var(--foreground)]">Full-Stack Developer</span> with hands-on experience in building real-time applications, authentication systems, and AI-powered solutions. 
            Proficient in modern web technologies, database design, and API architecture using TypeScript, Next.js, Express, and PostgreSQL.
          </p>
          <div className="mt-12 h-1 w-24 bg-[var(--border)]" />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
