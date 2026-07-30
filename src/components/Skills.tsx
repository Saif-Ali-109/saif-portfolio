"use client";

import React from 'react';
import { motion } from 'framer-motion';

const skillCategories = [
  {
    title: 'Frontend',
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'HTML/CSS']
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Drizzle ORM', 'Socket.IO', 'JWT', 'REST APIs']
  },
  {
    title: 'Auth & Security',
    skills: ['OAuth', 'NextAuth.js', 'scrypt', 'JWT', 'CORS', 'Rate Limiting']
  },
  {
    title: 'AI & LLM',
    skills: ['OpenAI SDK', 'Claude API', 'Prompt Engineering', 'AI Agents', 'MCP', 'RAG', 'Gemini API']
  },
  {
    title: 'DevOps & Cloud',
    skills: ['Git', 'npm', 'Monorepo', 'Docker', 'Firebase', 'Railway']
  }
];

const Skills = () => {
  return (
    <section id="skills" className="py-8 px-6 border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent)] mb-8">Technical Arsenal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
            {skillCategories.map((category, index) => (
              <motion.div 
                key={category.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-sm font-bold mb-6 text-gray-700 dark:text-gray-200 border-l-2 border-[var(--accent)] pl-4">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-4 py-1.5 bg-gray-50 dark:bg-[#111] text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest border border-gray-200 dark:border-[#1a1a1a] rounded-sm hover:bg-white dark:hover:bg-[#1a1a1a] hover:border-[var(--accent-light)] hover:text-[var(--accent)] transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
