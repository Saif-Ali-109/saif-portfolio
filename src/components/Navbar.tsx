"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setProgress(Math.min(1, Math.max(0, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight))));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ['about', 'skills', 'projects', 'education', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[var(--surface)]/80 backdrop-blur-xl border-b border-[var(--border)] py-4 shadow-lg shadow-black/5 dark:shadow-black/20' : 'bg-transparent py-8'}`}>
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
        <motion.a 
          href="#" 
          className="text-lg font-bold tracking-tight text-[var(--foreground)]"
          whileHover={{ scale: 1.02 }}
        >
          Saif Ali Wajid
        </motion.a>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-xs font-bold uppercase tracking-widest hover:text-[var(--accent)] transition-colors ${link.href === '#' + activeSection ? 'text-[var(--accent)]' : 'text-gray-600 dark:text-gray-500'}`}
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-[var(--accent)] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'crystal' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        {/* Mobile Toggle + Theme */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-[var(--accent)] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'crystal' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-[var(--accent)] transition-colors cursor-pointer" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu" aria-expanded={isOpen}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black/40 md:hidden" onClick={() => setIsOpen(false)} aria-hidden="true" />}

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--surface)] border-b border-[var(--border)] px-6 py-8 flex flex-col space-y-6"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-bold tracking-tighter text-[var(--foreground)]"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 h-0.5 bg-[var(--accent)] transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
    </nav>
  );
};

export default Navbar;
