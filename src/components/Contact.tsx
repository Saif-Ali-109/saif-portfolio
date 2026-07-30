"use client";

import React from 'react';
import { Mail, MessageCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Contact = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="contact" className={`py-8 px-6 transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-gray-50 text-[var(--foreground)]'}`}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className={`text-xs font-bold uppercase tracking-[0.4em] mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Collaboration</h2>
          <p className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight">
            Ready to initiate <br /> a <span className="text-[var(--accent)]">new venture?</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <a
              href="mailto:rsaif6863322@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-8 border rounded-sm transition-all group block ${isDark ? 'border-white/5 bg-white/[0.03] hover:bg-white/[0.06]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
            >
              <Mail className="text-[var(--accent)] mb-6 group-hover:scale-110 transition-transform" size={24} />
              <p className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Email</p>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>rsaif6863322@gmail.com</p>
            </a>

            <a
              href="https://wa.link/3usvbe"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-8 border rounded-sm transition-all group ${isDark ? 'border-white/5 bg-white/[0.03] hover:bg-white/[0.06]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
            >
              <MessageCircle className="text-green-400 mb-6 group-hover:scale-110 transition-transform" size={24} />
              <p className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>WhatsApp</p>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Connect on WA</p>
            </a>

            <a
              href="https://github.com/Saif-Ali-109"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-8 border rounded-sm transition-all group ${isDark ? 'border-white/5 bg-white/[0.03] hover:bg-white/[0.06]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
            >
              <GithubIcon />
              <div className="mt-6">
                <p className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>GitHub</p>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Saif-Ali-109</p>
              </div>
            </a>

            <div className={`p-8 border rounded-sm transition-all group ${isDark ? 'border-white/5 bg-white/[0.03] hover:bg-white/[0.06]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
              <a href="https://www.google.com/maps/place/Islamabad,+Pakistan/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <MapPin className="text-[var(--accent)] mb-6 group-hover:scale-110 transition-transform" size={24} />
                <p className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Location</p>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Islamabad, PK</p>
              </a>
            </div>
          </div>

          <div className={`mt-12 pt-10 border-t text-[10px] font-bold uppercase tracking-[0.2em] flex flex-col md:flex-row justify-between items-center gap-4 ${isDark ? 'border-white/5 text-gray-600' : 'border-gray-200 text-gray-400'}`}>
            <span>© {new Date().getFullYear()} SAIF ALI WAJID</span>
            <div className="flex gap-8">
              <a
                href="https://www.linkedin.com/in/saifali109/"
                target="_blank"
                rel="noopener noreferrer"
                className={`cursor-pointer transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div >
      </div >
    </section >
  );
};

export default Contact;
