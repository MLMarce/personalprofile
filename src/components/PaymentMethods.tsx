"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

// Tipos simplificados para el UI
export interface PaymentMethod {
  id: string;
  type: "mercadopago" | "paypal" | "crypto";
  label: string; // "Mercado Pago", "PayPal", "USDT (TRC20)", etc
  value: string; // Alias, Email, o Wallet
  network?: string; // Para crypto
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
}

export function PaymentMethods({ methods }: PaymentMethodsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!methods || methods.length === 0) return null;

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-center mb-8 tracking-tight">Métodos de Pago</h2>
      
      <div className="flex flex-col gap-4">
        {methods.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="glass glass-hover p-4 md:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                {/* Iconos según tipo */}
                {method.type === "mercadopago" && <span className="text-xl">🤝</span>}
                {method.type === "paypal" && <span className="text-xl">🅿️</span>}
                {method.type === "crypto" && <span className="text-xl">₿</span>}
              </div>
              <div>
                <h4 className="font-semibold text-white">
                  {method.label} {method.network && <span className="text-xs text-neon-blue ml-1 bg-neon-blue/10 px-2 py-0.5 rounded-md">{method.network}</span>}
                </h4>
                <p className="text-sm text-gray-400 font-mono mt-1 break-all">
                  {method.value}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleCopy(method.value, method.id)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center shrink-0"
            >
              {copiedId === method.id ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-300">Copiar</span>
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
