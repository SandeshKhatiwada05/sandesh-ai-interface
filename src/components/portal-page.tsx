'use client';

import { motion } from 'framer-motion';
import { Github, Instagram, Bot, LoaderCircle, Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ComponentType, type FormEvent } from 'react';

const heroVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4';
const solutionVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4';

type ChatRole = 'system' | 'user' | 'assistant';
type Message = { id: string; role: ChatRole; content: string };

const initialMessages: Message[] = [
  {
    id: 'system-init',
    role: 'system',
    content: 'You are the conversational heart of Sandesh AI. You must ALWAYS communicate strictly in English. Never use boring, generic, or robotic canned responses like "I don\'t have access to real-time data" or generic macro templates. If you lack data, be direct, conversational, witty, and deeply authentic. Keep your tone dark, minimal, sharp, and intellectual.'
  },
  {
    id: 'assistant-1',
    role: 'assistant',
    content: 'Welcome to सन्देश. Ask for an outline, a rewrite, or a concise strategic answer.'
  }
];

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

function LogoMark() {
  return (
    <div className="relative h-7 w-7 rounded-full border-2 border-white/60">
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
    </div>
  );
}

function SocialButton({ href, label, icon: Icon }: { href: string; label: string; icon: ComponentType<{ className?: string }> }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="liquid-glass relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/80 transition hover:bg-white/10"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

function MediumMark({ className }: { className?: string }) {
  return <span className={className} aria-hidden="true">M</span>;
}

function InlineHeroChat() {
  const [chatHistory, setChatHistory] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [chatHistory]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || isSending) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content };
    const nextMessages = [...chatHistory, userMessage];
    
    setChatHistory(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.map(({ role, content }) => ({ role, content })) })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'The chat service returned an error.');

      setChatHistory((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: data.message?.trim() || 'No response returned.' }
      ]);
    } catch (error) {
      setChatHistory((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: error instanceof Error ? error.message : 'System timeout occurred.' }
      ]);
    } finally {
      setIsSending(false);
    }
  }

  const visibleMessages = chatHistory.filter(msg => msg.role !== 'system');

  return (
    <div className="liquid-glass flex w-full max-w-5xl flex-col rounded-[2.5rem] border border-white/10 bg-card/25 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
      <header className="flex items-center justify-between border-b border-white/10 px-8 py-4 bg-black/10">
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold tracking-[0.35em] text-white/80">सन्देश AI</p>
            <p className="text-[11px] text-white/40 mt-0.5">English Language Node</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs tracking-widest text-white/30 uppercase">Secure Route</span>
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        </div>
      </header>

      <div ref={viewportRef} className="flex h-[calc(100vh-320px)] min-h-[280px] max-h-[500px] flex-col gap-4 overflow-y-auto px-8 py-6 scrollbar-thin text-left bg-black/5">
        {visibleMessages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={[
              'max-w-[80%] rounded-[1.5rem] px-5 py-3 text-base leading-7 break-words whitespace-pre-wrap shadow-md border',
              message.role === 'user' 
                ? 'border-white/15 bg-white/15 text-white rounded-tr-sm' 
                : 'border-white/5 bg-white/5 text-white/90 rounded-tl-sm'
            ].join(' ')}>
              {message.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2.5 text-sm text-white/50 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <LoaderCircle className="h-4 w-4 animate-spin text-white/60" />
              Generating response...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-white/10 p-5 bg-black/30">
        <div className="liquid-glass flex items-center gap-4 rounded-full border border-white/10 bg-black/50 px-5 py-1.5">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask anything..."
            className="min-w-0 flex-1 bg-transparent py-2 text-base text-white outline-none placeholder:text-white/30"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white text-black transition hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-20"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PortalPage() {
  const socialLinks = useMemo(
    () => [
      { href: 'https://github.com/SandeshKhatiwada05', label: 'GitHub', icon: Github },
      { href: 'https://www.instagram.com/itsme__sandesh/', label: 'Instagram', icon: Instagram },
      { href: 'https://medium.com/@khatiwadasandesh501', label: 'Medium', icon: MediumMark }
    ],
    []
  );

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background text-foreground selection:bg-white/20">
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video className="h-full w-full object-cover" autoPlay loop muted playsInline preload="auto" src={heroVideo} />
        <video className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-40" autoPlay loop muted playsInline preload="auto" src={solutionVideo} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/90" />
        <div className="absolute inset-0 noise-overlay opacity-40" />
      </div>

      <header className="absolute inset-x-0 top-0 z-50 px-8 py-4 md:px-28 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex items-center">
              <LogoMark />
            </div>
            <span className="text-sm font-bold tracking-[0.22em] text-white">
              सन्देश
            </span>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <SocialButton key={link.label} {...link} />
            ))}
          </div>
        </div>
      </header>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 pt-16">
        <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={fadeUp.transition} className="w-full flex justify-center">
          <InlineHeroChat />
        </motion.div>
      </div>

      <footer className="absolute bottom-0 inset-x-0 z-50 px-8 py-4 bg-gradient-to-t from-black/80 to-transparent text-center">
        <p className="text-xs text-white/35">© 2026 सन्देश. Secure English Language Node.</p>
      </footer>

    </main>
  );
}