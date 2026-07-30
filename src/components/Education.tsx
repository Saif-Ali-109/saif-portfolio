import React from 'react';

const Education = () => {
  return (
    <section id="education" className="py-8 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Education</h2>
        <div className="border-l-2 border-gray-200 dark:border-[#1a1a1a] pl-8 ml-2">
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
    </section>
  );
};

export default Education;
