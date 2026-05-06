"use client";

import { useState } from "react";
import { updateProfile, saveService, deleteService, savePaymentMethod, saveSocialLink, deleteSocialLink } from "./actions";
import { logout } from "../login/actions";
import { Edit2, Plus, Trash2, X, ExternalLink, Copy, Check } from "lucide-react";

export function AdminDashboard({ profile, services, payments, socialLinks }: any) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<any>(null);
  const [modalVariants, setModalVariants] = useState<any[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(typeof window !== 'undefined' ? `${window.location.origin}/${profile?.username}` : '');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openServiceModal = (service: any = null) => {
    setEditingService(service);
    if (service && service.service_variants && service.service_variants.length > 0) {
      const sorted = [...service.service_variants].sort((a, b) => (a.position || 0) - (b.position || 0));
      setModalVariants(sorted);
    } else {
      setModalVariants([{ id: Date.now().toString(), name: '', price_usd: '', price_ars: '' }]);
    }
    setActiveModal('service');
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingService(null);
    setEditingSocialLink(null);
    setModalVariants([]);
  };

  const addVariant = () => {
    setModalVariants([...modalVariants, { id: Date.now().toString(), name: '', price_usd: '', price_ars: '' }]);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...modalVariants];
    newVariants.splice(index, 1);
    setModalVariants(newVariants);
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...modalVariants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setModalVariants(newVariants);
  };

  const getPaymentValue = (type: string) => {
    const p = payments.find((p: any) => p.type === type || p.crypto === type);
    return p ? (p.mp_alias || p.paypal_email || p.wallet_address) : "";
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          {profile?.username && (
            <div className="flex items-center gap-2 mt-2 text-sm bg-white/5 p-2 rounded-lg border border-white/10 w-fit">
              <span className="text-gray-400 hidden sm:inline">Tu link:</span>
              <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:text-neon-purple font-medium flex items-center gap-1 transition-colors">
                Ver perfil público <ExternalLink className="w-3 h-3" />
              </a>
              <div className="w-px h-4 bg-white/20 mx-1"></div>
              <button onClick={handleCopyLink} className="p-1.5 hover:bg-white/10 rounded transition-colors flex items-center gap-1 text-gray-300" title="Copiar URL">
                {copiedLink ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-xs text-green-400">Copiado</span></> : <><Copy className="w-3.5 h-3.5" /><span className="text-xs">Copiar</span></>}
              </button>
            </div>
          )}
        </div>
        <button onClick={() => logout()} className="text-sm px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="glass p-6 rounded-2xl md:col-span-1">
          <h2 className="text-xl font-semibold text-neon-blue mb-4">Perfil</h2>
          <p className="text-sm text-gray-400 mb-4">Configura tu identidad pública.</p>
          <div className="mb-4">
            <p className="font-bold">{profile?.artist_name}</p>
            <p className="text-sm text-gray-400">@{profile?.username}</p>
          </div>
          <button onClick={() => setActiveModal('profile')} className="w-full py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors flex justify-center items-center gap-2">
            <Edit2 className="w-4 h-4" /> Editar Perfil
          </button>
        </div>

        {/* Services Card */}
        <div className="glass p-6 rounded-2xl md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-neon-purple">Servicios</h2>
            <button onClick={() => openServiceModal()} className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-sm rounded-md hover:bg-neon-purple/30 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> Nuevo Servicio
            </button>
          </div>
          
          <div className="space-y-3">
            {(!services || services.length === 0) && <p className="text-gray-500 text-sm">No tienes servicios configurados.</p>}
            {Array.from(new Map(services?.map((s: any) => [s.id, s])).values()).map((s: any) => (
              <div key={s.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                <div>
                  <h3 className="font-semibold">{s.title} {s.is_popular && <span className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded ml-2">Popular</span>}</h3>
                  <p className="text-xs text-gray-400">${s.price_usd} USD</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openServiceModal(s)} className="p-2 bg-white/10 rounded hover:bg-white/20"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={async () => await deleteService(s.id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payments Card */}
        <div className="glass p-6 rounded-2xl md:col-span-3">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-semibold text-white">Métodos de Pago</h2>
             <button onClick={() => setActiveModal('payments')} className="px-3 py-1 bg-white/10 text-white text-sm rounded-md hover:bg-white/20 transition-colors flex items-center gap-1">
                <Edit2 className="w-4 h-4" /> Configurar
             </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
               <h3 className="font-semibold mb-1">Mercado Pago</h3>
               <p className="text-xs text-gray-500 truncate">{getPaymentValue('mercadopago') || 'No configurado'}</p>
             </div>
             <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
               <h3 className="font-semibold mb-1">PayPal</h3>
               <p className="text-xs text-gray-500 truncate">{getPaymentValue('paypal') || 'No configurado'}</p>
             </div>
             <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
               <h3 className="font-semibold mb-1">Cripto (USDT)</h3>
               <p className="text-xs text-gray-500 truncate">{getPaymentValue('USDT') || 'No configurado'}</p>
             </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className="glass p-6 rounded-2xl md:col-span-3">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-semibold text-white">Redes Sociales</h2>
             <button onClick={() => setActiveModal('social')} className="px-3 py-1 bg-white/10 text-white text-sm rounded-md hover:bg-white/20 transition-colors flex items-center gap-1">
                <Plus className="w-4 h-4" /> Agregar Plataforma
             </button>
          </div>
          <div className="space-y-3">
            {(!socialLinks || socialLinks.length === 0) && <p className="text-gray-500 text-sm">No tienes redes sociales configuradas.</p>}
            {socialLinks?.map((s: any) => (
              <div key={s.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                <div>
                  <h3 className="font-semibold">{s.platform}</h3>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-neon-blue hover:underline truncate inline-block max-w-[200px] sm:max-w-xs">{s.url}</a>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingSocialLink(s); setActiveModal('social'); }} className="p-2 bg-white/10 rounded hover:bg-white/20"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={async () => await deleteSocialLink(s.id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg rounded-2xl p-6 relative shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"><X className="w-6 h-6" /></button>
            
            {activeModal === 'profile' && (
              <form action={async (fd) => { await updateProfile(fd); closeModal(); }}>
                <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nombre Artístico</label>
                    <input name="artist_name" defaultValue={profile?.artist_name} className="w-full bg-white/5 border border-white/10 rounded p-2 focus:border-neon-blue outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Biografía</label>
                    <textarea name="bio" defaultValue={profile?.bio} className="w-full bg-white/5 border border-white/10 rounded p-2 focus:border-neon-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">URL Avatar (Opcional)</label>
                    <input name="avatar_url" defaultValue={profile?.avatar_url} className="w-full bg-white/5 border border-white/10 rounded p-2 focus:border-neon-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Usuario Telegram (Sin @)</label>
                    <input name="telegram_username" defaultValue={profile?.telegram_username} className="w-full bg-white/5 border border-white/10 rounded p-2 focus:border-neon-blue outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-neon-blue/20 text-neon-blue font-bold py-2 rounded mt-4 hover:bg-neon-blue/30">Guardar Perfil</button>
                </div>
              </form>
            )}

            {activeModal === 'service' && (
              <form action={async (fd) => { await saveService(fd); closeModal(); }}>
                <h2 className="text-xl font-bold mb-4">{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
                {editingService && <input type="hidden" name="id" value={editingService.id} />}
                <input type="hidden" name="variants" value={JSON.stringify(modalVariants)} />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Título del paquete</label>
                    <input name="title" defaultValue={editingService?.title} className="w-full bg-white/5 border border-white/10 rounded p-2 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Descripción</label>
                    <textarea name="description" defaultValue={editingService?.description} className="w-full bg-white/5 border border-white/10 rounded p-2 outline-none" />
                  </div>
                  
                  <div className="border-t border-white/10 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-neon-blue">Variantes del Servicio</h3>
                      <button type="button" onClick={addVariant} className="text-xs bg-neon-blue/20 text-neon-blue px-2 py-1 rounded hover:bg-neon-blue/30 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Agregar Variante
                      </button>
                    </div>
                    
                    {modalVariants.length === 0 && (
                      <p className="text-xs text-gray-500 mb-3">Agrega al menos una variante (ej: "Básico", "Premium")</p>
                    )}
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {modalVariants.map((variant, index) => (
                        <div key={variant.id || index} className="p-3 bg-white/5 border border-white/10 rounded-lg relative">
                          <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400">
                            <X className="w-4 h-4" />
                          </button>
                          <div className="space-y-2 pr-6">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Nombre</label>
                              <input value={variant.name} onChange={(e) => updateVariant(index, 'name', e.target.value)} placeholder="Ej: Premium" className="w-full bg-black/20 border border-white/5 rounded p-1.5 text-sm outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Precio USD</label>
                                <input type="number" step="0.01" value={variant.price_usd || ''} onChange={(e) => updateVariant(index, 'price_usd', e.target.value)} className="w-full bg-black/20 border border-white/5 rounded p-1.5 text-sm outline-none" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Precio ARS</label>
                                <input type="number" step="0.01" value={variant.price_ars || ''} onChange={(e) => updateVariant(index, 'price_ars', e.target.value)} className="w-full bg-black/20 border border-white/5 rounded p-1.5 text-sm outline-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                    <input type="checkbox" name="is_popular" id="is_popular" defaultChecked={editingService?.is_popular} className="w-4 h-4" />
                    <label htmlFor="is_popular" className="text-sm">Marcar como "Más Popular"</label>
                  </div>
                  <button type="submit" className="w-full bg-neon-purple/20 text-neon-purple font-bold py-2 rounded mt-4 hover:bg-neon-purple/30">Guardar Servicio</button>
                </div>
              </form>
            )}

            {activeModal === 'payments' && (
              <form action={async (fd) => { await savePaymentMethod(fd); closeModal(); }}>
                <h2 className="text-xl font-bold mb-4">Configurar Método de Pago</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tipo</label>
                    <select name="type" className="w-full bg-white/5 border border-white/10 rounded p-2 outline-none text-white">
                      <option value="mercadopago">Mercado Pago</option>
                      <option value="paypal">PayPal</option>
                      <option value="crypto">USDT (Crypto)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Valor (Alias / Email / Wallet)</label>
                    <input name="value" className="w-full bg-white/5 border border-white/10 rounded p-2 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Red Crypto (Solo si aplica, ej: TRC20)</label>
                    <input name="network" className="w-full bg-white/5 border border-white/10 rounded p-2 outline-none" defaultValue="TRC20" />
                  </div>
                  <p className="text-xs text-gray-500">Nota: Al guardar reemplazará el valor anterior para el tipo seleccionado.</p>
                  <button type="submit" className="w-full bg-white text-black font-bold py-2 rounded mt-4 hover:bg-gray-200">Guardar Método</button>
                </div>
              </form>
            )}

            {activeModal === 'social' && (
              <form action={async (fd) => { await saveSocialLink(fd); closeModal(); }}>
                <h2 className="text-xl font-bold mb-4">{editingSocialLink ? 'Editar Plataforma' : 'Nueva Plataforma'}</h2>
                {editingSocialLink && <input type="hidden" name="id" value={editingSocialLink.id} />}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nombre de la plataforma (Ej: X, OnlyFans, TikTok)</label>
                    <input name="platform" defaultValue={editingSocialLink?.platform} className="w-full bg-white/5 border border-white/10 rounded p-2 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">URL</label>
                    <input type="url" name="url" defaultValue={editingSocialLink?.url} placeholder="https://" className="w-full bg-white/5 border border-white/10 rounded p-2 outline-none" required />
                  </div>
                  <button type="submit" className="w-full bg-white text-black font-bold py-2 rounded mt-4 hover:bg-gray-200">Guardar Plataforma</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
