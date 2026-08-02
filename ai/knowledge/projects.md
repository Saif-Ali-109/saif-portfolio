# Projects

## Connext

**Type:** Full-Stack Real-Time Messaging App
**Status:** Live at https://connext-frontend-production.up.railway.app/

### Description
A modern, real-time one-to-one messaging application with flexible authentication (username/password, email/password, Google OAuth), user discovery, shareable invite links with 7-day expiry, live message receipts (Sent/Delivered/Read), browser notifications, and a polished dark mode UI.

### Tech Stack
Next.js 15, React 19, TypeScript, Tailwind CSS, Express.js, PostgreSQL, Drizzle ORM, Socket.IO, NextAuth.js, JWT, scrypt, Framer Motion

### Key Features
- **Authentication:** Supports username/password, email/password, and Google OAuth via NextAuth.js
- **Real-time messaging:** Built with Socket.IO with live message receipts (Sent, Delivered, Read)
- **User discovery:** Find users, send connection requests, and share invite links with 7-day expiry
- **Monorepo architecture:** Organized as npm workspaces with separate web, server, and shared database packages
- **Push notifications:** Browser notifications via Firebase Cloud Messaging
- **Dark mode UI:** Polished dark theme with Framer Motion animations

### Links
- Documentation: see the project README.md and the "Connext" section above for full technical details (authentication, architecture, API reference)
- GitHub: https://github.com/Saif-Ali-109/Connext
- Live: https://connext-frontend-production.up.railway.app/

## Portfolio Website (This Site)
**Type:** Developer Portfolio
**Status:** Live

### Description
A modern single-page developer portfolio built with Next.js 16, React 19, and Tailwind CSS v4. Features an AI-powered chat assistant (Saifbot) that answers visitor questions using RAG (Retrieval-Augmented Generation). Supports crystal clear and dark themes.

### Tech Stack
Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, FastAPI (Python RAG backend), Google Gemini AI

