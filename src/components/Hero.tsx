"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface HeroProps {
  name: string;
  bio: string;
  avatarUrl: string | null;
  telegramUrl?: string;
}

export function Hero({ name, bio, avatarUrl, telegramUrl }: HeroProps) {
  const defaultAvatar = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

  return (
    <section className="relative flex flex-col items-center justify-center py-16 px-4 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-neon-purple/20 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center w-full max-w-md"
      >
        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-neon-blue to-neon-purple shadow-[0_0_20px_rgba(157,0,255,0.3)] mb-6">
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <img
              src={avatarUrl || defaultAvatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gray-300 mb-8 text-lg"
        >
          {bio || "Contenido exclusivo y personalizado 🔥"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full"
        >
          <a
            href="#services"
            className="flex-1 flex items-center justify-center py-3 px-6 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Ver servicios
          </a>
          <a
            href={telegramUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl glass glass-hover text-white font-semibold transition-all"
          >
            <Send className="w-4 h-4 text-neon-blue" />
            Contactar
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
