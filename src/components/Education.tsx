import React from 'react';
import Image from 'next/image';

const Education = () => {
  return (
    <section id="education" className="py-8 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent)] mb-8">Education</h2>
        <div className="border-l-2 border-gray-200 dark:border-[#1a1a1a] pl-8 ml-2 space-y-10">
          <div className="flex items-start gap-6">
            <Image src="/piaic-logo.png" alt="PIAIC" width={60} height={82} className="rounded-md shrink-0 mt-1" />
            <div>
              <span className="text-sm font-bold text-[var(--accent)] uppercase tracking-tighter">2025 — 2027 (Expected)</span>
              <h3 className="text-2xl font-bold mt-2 text-[var(--foreground)]">PIAIC</h3>
              <p className="text-[var(--muted)] font-medium">Islamabad, Pakistan</p>
              <p className="mt-4 text-[var(--muted)] text-lg">
                AI Automation Engineering (Currently Studying)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-6">
            <Image src="/bahria-logo.png" alt="Bahria University" width={60} height={60} className="rounded-md shrink-0 mt-1" />
            <div>
              <span className="text-sm font-bold text-[var(--accent)] uppercase tracking-tighter">2024 — 2028 (Expected)</span>
              <h3 className="text-2xl font-bold mt-2 text-[var(--foreground)]">Bahria University</h3>
              <p className="text-[var(--muted)] font-medium">E-8, Islamabad, Pakistan</p>
              <p className="mt-4 text-[var(--muted)] text-lg">
                Bachelor of Computer Science (Currently Studying)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
