import { createClient } from '@/utils/supabase/server'
import { AdminDashboard } from './AdminDashboard'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // 1. Obtener perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 2. Obtener servicios
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })
  
  // 3. Obtener métodos de pago
  const { data: fiatMethods } = await supabase.from('payment_methods').select('*').eq('profile_id', user.id)
  const { data: cryptoMethods } = await supabase.from('crypto_wallets').select('*').eq('profile_id', user.id)
  
  const payments = [...(fiatMethods || []), ...(cryptoMethods || [])]

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <AdminDashboard profile={profile} services={services || []} payments={payments} />
    </main>
  )
}
