"use client";

import React from 'react';

import { motion } from 'framer-motion';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const projects = [
  {
    title: 'Connext',
    type: 'Full-Stack Real-Time Messaging App',
    description: 'A real-time one-to-one messaging platform with flexible authentication (username/password, email/password, Google OAuth 2.0), user discovery, connection requests, shareable invite links with 7-day expiry, live message receipts (Sent/Delivered/Read), browser notifications via Firebase Cloud Messaging, media sharing via Cloudflare R2, and a polished dark mode UI.',
    stack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Express', 'PostgreSQL', 'Drizzle ORM', 'Socket.IO', 'NextAuth.js', 'JWT', 'scrypt', 'Framer Motion'],
    github: 'https://github.com/Saif-Ali-109/Connext',
    live: 'https://connext-frontend-production.up.railway.app/',
    highlights: [
      'Flexible authentication: username/password, email/password, and Google OAuth 2.0 via NextAuth.js with 6-digit email verification codes (rate-limited via Brevo API)',
      'Real-time WebSocket messaging with Socket.IO — live Sent/Delivered/Read receipts, typing indicators, presence detection',
      'User discovery & connection requests: search by username or email, approve pairs, shareable invite links with 7-day expiry',
      'Two-layer session architecture: NextAuth JWT + Express httpOnly JWT via HMAC-SHA256 bridge (60s TTL bridge payload)',
      'Media sharing: image/file uploads to Cloudflare R2 with presigned URLs (25MB limit, requires accepted connection for download)',
      'Push notifications via Firebase Cloud Messaging with real-time browser notification alerts'
    ]
  }
];

const Projects = () => {
  return (
    <section id="projects" className="py-8 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent)] mb-10">Selected Works</h2>
        <div className="space-y-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group"
            >
              <div className="grid md:grid-cols-2 gap-16 items-start">
                <div className="relative order-2 md:order-1">
                  <div className="absolute -top-10 -left-10 text-9xl font-bold text-gray-100 dark:text-white/[0.02] select-none z-0">
                    0{index + 1}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-bold mb-4 tracking-tighter text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[var(--accent)] font-bold text-xs uppercase tracking-[0.2em] mb-8">{project.type}</p>
                    <p className="text-[var(--muted)] text-lg leading-relaxed mb-10 font-light">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mb-10">
                      {project.stack.map((item) => (
                        <span key={item} className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest border-b border-gray-200 dark:border-[#1a1a1a]">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-6">
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-[var(--accent)] transition-colors">
                        <GithubIcon />
                        <span>Source</span>
                      </a>
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-[var(--accent)] transition-colors">
                          <ExternalLinkIcon />
                          <span>Live</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="order-1 md:order-2">
                  <ul className="space-y-6">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="flex gap-4 text-sm text-[var(--muted)] font-light leading-relaxed">
                        <span className="text-[var(--accent)] font-bold">/</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
