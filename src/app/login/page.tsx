import { login, signup } from './actions'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; tab?: string }>
}) {
  const resolvedParams = await searchParams
  const isRegister = resolvedParams.tab === 'register'

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-neon-purple/20 rounded-full blur-[100px] -z-10" />

      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-gray-300 bg-white/5 hover:bg-white/10 flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Volver
      </Link>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
          {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h1>

        <div className="flex bg-white/5 p-1 rounded-lg mb-4">
          <Link 
            href="/login" 
            className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition-colors ${!isRegister ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Login
          </Link>
          <Link 
            href="/login?tab=register" 
            className={`flex-1 text-center py-2 rounded-md text-sm font-medium transition-colors ${isRegister ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Registro
          </Link>
        </div>

        {isRegister && (
          <>
            <label className="text-md font-medium text-gray-300" htmlFor="username">
              Username (para tu URL)
            </label>
            <input
              className="rounded-lg px-4 py-3 bg-white/5 border border-white/10 mb-4 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50"
              name="username"
              placeholder="Ej: sofiax"
              required
            />
            
            <label className="text-md font-medium text-gray-300" htmlFor="artist_name">
              Nombre Artístico
            </label>
            <input
              className="rounded-lg px-4 py-3 bg-white/5 border border-white/10 mb-4 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50"
              name="artist_name"
              placeholder="Ej: Sofia X"
              required
            />
          </>
        )}

        <label className="text-md font-medium text-gray-300" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-lg px-4 py-3 bg-white/5 border border-white/10 mb-4 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50"
          name="email"
          placeholder="tu@email.com"
          required
        />
        
        <label className="text-md font-medium text-gray-300" htmlFor="password">
          Contraseña
        </label>
        <input
          className="rounded-lg px-4 py-3 bg-white/5 border border-white/10 mb-6 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />

        <button
          formAction={isRegister ? signup : login}
          className="glass glass-hover font-bold text-white px-4 py-3 rounded-xl mb-4"
        >
          {isRegister ? 'Registrarse' : 'Entrar al Panel'}
        </button>

        {resolvedParams?.message && (
          <p className="mt-4 p-4 bg-white/5 border border-red-500/30 text-red-400 text-center rounded-xl text-sm">
            {resolvedParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
