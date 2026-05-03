"use client";

import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingContactProps {
  telegramUrl: string;
}

export function FloatingContact({ telegramUrl }: FloatingContactProps) {
  if (!telegramUrl) return null;

  return (
    <motion.a
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5, type: "spring" }}
      href={telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#0088cc] to-[#00a2f2] text-white shadow-[0_0_20px_rgba(0,136,204,0.4)] hover:shadow-[0_0_30px_rgba(0,136,204,0.6)] hover:scale-110 transition-all duration-300"
      aria-label="Contact on Telegram"
    >
      <Send className="w-6 h-6 ml-[-2px] mt-[2px]" />
    </motion.a>
  );
}
