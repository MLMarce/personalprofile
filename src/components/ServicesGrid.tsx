"use client";

import { motion } from "framer-motion";

export interface Service {
  id: string;
  title: string;
  description: string;
  price_ars: number | null;
  price_usd: number | null;
  is_popular: boolean;
}

interface ServicesGridProps {
  services: Service[];
  telegramUrl?: string;
}

export function ServicesGrid({ services, telegramUrl }: ServicesGridProps) {
  // Orden inteligente: popular al principio o medio, esto dependerá del array recibido
  // Por ahora, asumimos que vienen ordenados o aplicamos un sort si es necesario
  const sortedServices = [...services].sort((a, b) => {
    if (a.is_popular && !b.is_popular) return -1;
    if (!a.is_popular && b.is_popular) return 1;
    return (a.price_usd || 0) - (b.price_usd || 0); // De menor a mayor
  });

  return (
    <section id="services" className="py-12 px-4 max-w-5xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">Paquetes & Servicios</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {sortedServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 ${
              service.is_popular 
                ? "glass border-neon-blue/40 shadow-[0_0_30px_rgba(0,243,255,0.15)] scale-100 md:scale-105 z-10" 
                : "glass glass-hover"
            }`}
          >
            {service.is_popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                🔥 Más Popular
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
            <p className="text-gray-400 text-sm mb-6 flex-grow">{service.description}</p>
            
            <div className="flex flex-col mb-6">
              {service.price_usd && (
                <span className="text-3xl font-bold text-white mb-1">
                  ${service.price_usd} <span className="text-sm font-normal text-gray-400">USD</span>
                </span>
              )}
              {service.price_ars && (
                <span className="text-md text-gray-500 font-medium">
                  ${service.price_ars} <span className="text-xs">ARS</span>
                </span>
              )}
            </div>
            
            <a
              href={telegramUrl ? `${telegramUrl}?text=${encodeURIComponent(`Hola, me interesa el servicio: ${service.title}`)}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all ${
                service.is_popular 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Consultar
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
