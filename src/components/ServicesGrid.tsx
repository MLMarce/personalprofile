"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface ServiceVariant {
  id: string;
  name: string;
  price_usd: number | null;
  price_ars: number | null;
  position: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  is_popular: boolean;
  service_variants?: ServiceVariant[];
}

interface ServicesGridProps {
  services: Service[];
  telegramUrl?: string;
}

function ServiceCard({ service, telegramUrl, index }: { service: Service, telegramUrl?: string, index: number }) {
  const variants = service.service_variants ? [...service.service_variants].sort((a, b) => a.position - b.position) : [];
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  
  const selectedVariant = variants[selectedVariantIdx];

  const getPriceUsd = () => selectedVariant?.price_usd;
  const getPriceArs = () => selectedVariant?.price_ars;

  return (
    <motion.div
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
      
      {variants.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {variants.map((v, idx) => (
            <button
              key={v.id || idx}
              onClick={() => setSelectedVariantIdx(idx)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                selectedVariantIdx === idx
                  ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-[0_0_10px_rgba(0,243,255,0.3)]"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col mb-6 min-h-[4rem] justify-end">
        {getPriceUsd() ? (
          <span className="text-3xl font-bold text-white mb-1">
            ${getPriceUsd()} <span className="text-sm font-normal text-gray-400">USD</span>
          </span>
        ) : null}
        {getPriceArs() ? (
          <span className="text-md text-gray-500 font-medium">
            ${getPriceArs()} <span className="text-xs">ARS</span>
          </span>
        ) : null}
        {!getPriceUsd() && !getPriceArs() && (
          <span className="text-xl font-bold text-gray-500 italic">
            Precio a consultar
          </span>
        )}
      </div>
      
      <a
        href={telegramUrl ? `${telegramUrl}?text=${encodeURIComponent(`Hola, me interesa el servicio: ${service.title}${selectedVariant ? ` (${selectedVariant.name})` : ''}`)}` : "#"}
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
  );
}

export function ServicesGrid({ services, telegramUrl }: ServicesGridProps) {
  // Orden inteligente: popular al principio o medio, esto dependerá del array recibido
  // Por ahora, asumimos que vienen ordenados o aplicamos un sort si es necesario
  const sortedServices = [...services].sort((a, b) => {
    if (a.is_popular && !b.is_popular) return -1;
    if (!a.is_popular && b.is_popular) return 1;
    
    const getMinPrice = (srv: Service) => {
      if (!srv.service_variants || srv.service_variants.length === 0) return 0;
      return Math.min(...srv.service_variants.map(v => v.price_usd || 0));
    };

    return getMinPrice(a) - getMinPrice(b);
  });

  return (
    <section id="services" className="py-12 px-4 max-w-5xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">Paquetes & Servicios</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {sortedServices.map((service, index) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            telegramUrl={telegramUrl} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
}
