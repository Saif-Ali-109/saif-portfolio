"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SavedMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string | Date;
}

// Brand SVG icons injected inline next to platform links
const BRAND_ICONS: Record<string, string> = {
  'wa.link': `<svg viewBox="0 0 24 24" fill="#25D366" width="13" height="13" style="display:inline;vertical-align:middle;margin-right:3px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  'linkedin.com': `<svg viewBox="0 0 24 24" fill="#0A66C2" width="13" height="13" style="display:inline;vertical-align:middle;margin-right:3px"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  'github.com': `<svg viewBox="0 0 24 24" fill="#ffffff" width="13" height="13" style="display:inline;vertical-align:middle;margin-right:3px"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  'gmail.com': `<svg viewBox="0 0 24 24" fill="#EA4335" width="13" height="13" style="display:inline;vertical-align:middle;margin-right:3px"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>`,
  'mailto:': `<svg viewBox="0 0 24 24" fill="#EA4335" width="13" height="13" style="display:inline;vertical-align:middle;margin-right:3px"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>`,
};

function getIconForUrl(url: string): string {
  for (const [domain, svg] of Object.entries(BRAND_ICONS)) {
    if (url.includes(domain)) return svg;
  }
  // Generic link icon for unknown URLs
  return `<svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" width="13" height="13" style="display:inline;vertical-align:middle;margin-right:3px"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`;
}

/** Converts a subset of Markdown to safe HTML for chat bubbles.
 *  Handles: [text](url), **bold**, * bullet items, newlines, and brand icons.
 */
function renderMarkdown(text: string): string {
  return (
    text
      // Escape any existing HTML to prevent XSS
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Bold: **text**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Markdown links: [label](url) — with brand icons
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        (_match, label, url) =>
          `${getIconForUrl(url)}<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:underline;">${label}</a>`
      )
      // Plain bare URLs — with brand icons
      .replace(
        /(^|[\s(,])(https?:\/\/[^\s<)"]+)/g,
        (_match, prefix, url) =>
          `${prefix}${getIconForUrl(url)}<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:underline;">${url}</a>`
      )
      // Email addresses (e.g. rsaif6863322@gmail.com)
      .replace(
        /(^|[\s(,])([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
        (_match, prefix, email) =>
          `${prefix}${getIconForUrl('gmail.com')}<a href="mailto:${email}" style="color:#60a5fa;text-decoration:underline;">${email}</a>`
      )
      // Bullet lines starting with "* " or "- "
      .replace(/^[*-] (.+)$/gm, '<li style="margin-left:1rem;list-style-type:disc;">$1</li>')
      // Newlines → <br />
      .replace(/\n/g, '<br />')
  );
}


const QUICK_QUESTIONS = [
  "What are Saif's skills?",
  "Tell me about the Connext project",
  "How can I contact or hire Saif?",
  "Where is Saif studying?"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize session and load chat history asynchronously to prevent ESLint set-state-in-effect error
  useEffect(() => {
    const initSession = () => {
      // Check local storage for session
      let savedSessionId = localStorage.getItem('saifbot_session_id');
      const sessionTimestamp = localStorage.getItem('saifbot_session_timestamp');
      const now = Date.now();

      // 1-hour expiry on the client side as well
      if (!savedSessionId || !sessionTimestamp || now - parseInt(sessionTimestamp) > 3600000) {
        savedSessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + now;
        localStorage.setItem('saifbot_session_id', savedSessionId);
        localStorage.setItem('saifbot_session_timestamp', now.toString());
        localStorage.removeItem('saifbot_chat_history');
        
        // Initial welcome message
        const welcome: Message = {
          role: 'assistant',
          content: "Hi! I am Saif's AI Assistant. Ask me anything about his skills, education, projects, or how to contact him!",
          timestamp: new Date()
        };
        setMessages([welcome]);
      } else {
        // Load saved messages
        const savedHistory = localStorage.getItem('saifbot_chat_history');
        if (savedHistory) {
          try {
            const parsed = (JSON.parse(savedHistory) as SavedMessage[]).map((m) => ({
              ...m,
              timestamp: new Date(m.timestamp)
            }));
            setMessages(parsed);
          } catch (e) {
            console.error("Failed to parse chat history:", e);
          }
        } else {
          const welcome: Message = {
            role: 'assistant',
            content: "Hi! I am Saif's AI Assistant. Ask me anything about his skills, education, projects, or how to contact him!",
            timestamp: new Date()
          };
          setMessages([welcome]);
        }
      }
      setSessionId(savedSessionId);
    };

    // Run asynchronously to satisfy linter rule
    const timer = setTimeout(initSession, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save history to local storage when messages update
  useEffect(() => {
    if (messages.length > 0 && sessionId) {
      localStorage.setItem('saifbot_chat_history', JSON.stringify(messages));
      localStorage.setItem('saifbot_session_timestamp', Date.now().toString());
    }
    scrollToBottom();
  }, [messages, sessionId]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setHasInteracted(true);
    setErrorMsg(null);
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8001';
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          history: messages.map(({ role, content }) => ({ role, content }))
        })
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.response || "We are currently unavailable for some time.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error("Failed to communicate with AI Assistant:", e);
      const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8001';
      setErrorMsg(`Failed to connect to the AI assistant. Please ensure the Python backend is running at ${apiUrl}.`);
      
      const errorReply: Message = {
        role: 'assistant',
        content: "Sorry, I couldn't reach the server. We are currently unavailable for some time.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
      // Re-focus input so user can type immediately
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleResetSession = () => {
    const now = Date.now();
    const newSessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + now;
    localStorage.setItem('saifbot_session_id', newSessionId);
    localStorage.setItem('saifbot_session_timestamp', now.toString());
    localStorage.removeItem('saifbot_chat_history');
    setSessionId(newSessionId);
    setMessages([
      {
        role: 'assistant',
        content: "Session reset. Ask me anything about Saif!",
        timestamp: new Date()
      }
    ]);
    setErrorMsg(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="mb-4 w-[380px] h-[550px] bg-black/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white relative">
                  <Bot size={18} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Saifbot</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Saif&apos;s Professional AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetSession}
                  className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Reset Session"
                >
                  <RefreshCw size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <span
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                      />
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 max-w-[85%] mr-auto items-center">
                  <div className="w-7 h-7 rounded-full bg-white/10 text-gray-300 flex items-center justify-center shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="p-3 bg-white/10 border border-white/5 rounded-xl rounded-tl-none flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl flex gap-2 items-start text-[10px] text-red-300">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {!hasInteracted && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 justify-start">
                {QUICK_QUESTIONS.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(question)}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 rounded-full text-[10px] text-gray-300 hover:text-blue-400 transition-all text-left cursor-pointer"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 border-t border-white/10 bg-white/5 flex gap-2 items-center"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me about Saif's projects or skills..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 active:scale-95 disabled:bg-white/5 disabled:text-gray-600 disabled:scale-100 transition-all cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble Icon Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-blue-500 transition-colors relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle size={24} />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-blue-600 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
