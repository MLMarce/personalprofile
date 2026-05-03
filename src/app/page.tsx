import Link from "next/link";
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let username = 'sofiax' // URL de demostración por defecto
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
      
    if (profile?.username) {
      username = profile.username
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-neon-blue/20 rounded-full blur-[120px] -z-10" />
      
      <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
        Plataforma Premium
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mb-10">
        La solución definitiva para creadores de contenido exclusivo. Configura tu perfil, añade tus servicios y recibe pagos con altas tasas de conversión.
      </p>
      
      <div className="flex gap-4">
        {user ? (
          <Link 
            href="/admin" 
            className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Ir al Panel
          </Link>
        ) : (
          <Link 
            href="/login" 
            className="px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Crear Perfil / Iniciar Sesión
          </Link>
        )}
        <Link 
          href={`/${username}`} 
          className="px-8 py-4 rounded-xl glass glass-hover text-white font-bold transition-colors"
        >
          Ver Demo ({username})
        </Link>
      </div>
    </main>
  );
}
