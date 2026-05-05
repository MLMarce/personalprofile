'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const artistName = formData.get('artist_name') as string
  const bio = formData.get('bio') as string
  const rawAvatarUrl = formData.get('avatar_url') as string
  let avatarUrl = rawAvatarUrl?.trim() || null
  if (avatarUrl && !avatarUrl.startsWith('http')) {
    avatarUrl = 'https://' + avatarUrl
  }
  const rawTelegramUsername = formData.get('telegram_username') as string
  const telegramUsername = rawTelegramUsername?.trim() || null

  const { error } = await supabase
    .from('profiles')
    .update({
      artist_name: artistName,
      bio,
      avatar_url: avatarUrl,
      telegram_username: telegramUsername,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/admin')
  revalidatePath('/[username]', 'page')
  return { success: true }
}

export async function saveService(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priceUsd = Number(formData.get('price_usd'))
  const priceArs = Number(formData.get('price_ars'))
  const isPopular = formData.get('is_popular') === 'on'

  if (id) {
    const { error } = await supabase
      .from('services')
      .update({ title, description, price_usd: priceUsd, price_ars: priceArs, is_popular: isPopular })
      .eq('id', id)
      .eq('profile_id', user.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('services')
      .insert({ profile_id: user.id, title, description, price_usd: priceUsd, price_ars: priceArs, is_popular: isPopular })
    if (error) return { error: error.message }
  }
  
  revalidatePath('/admin')
  revalidatePath('/[username]', 'page')
  return { success: true }
}

export async function deleteService(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/admin')
  revalidatePath('/[username]', 'page')
  return { success: true }
}

export async function savePaymentMethod(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const type = formData.get('type') as string
  const value = formData.get('value') as string
  const network = formData.get('network') as string

  if (type === 'mercadopago') {
    const { data: existing } = await supabase.from('payment_methods').select('id').eq('profile_id', user.id).eq('type', 'mercadopago').maybeSingle()
    if (existing) {
      await supabase.from('payment_methods').update({ mp_alias: value }).eq('id', existing.id)
    } else {
      await supabase.from('payment_methods').insert({ profile_id: user.id, type: 'mercadopago', mp_alias: value })
    }
  } else if (type === 'paypal') {
    const { data: existing } = await supabase.from('payment_methods').select('id').eq('profile_id', user.id).eq('type', 'paypal').maybeSingle()
    if (existing) {
      await supabase.from('payment_methods').update({ paypal_email: value }).eq('id', existing.id)
    } else {
      await supabase.from('payment_methods').insert({ profile_id: user.id, type: 'paypal', paypal_email: value })
    }
  } else if (type === 'crypto') {
    const { data: existing } = await supabase.from('crypto_wallets').select('id').eq('profile_id', user.id).eq('crypto', 'USDT').eq('network', network || 'TRC20').maybeSingle()
    if (existing) {
      await supabase.from('crypto_wallets').update({ wallet_address: value }).eq('id', existing.id)
    } else {
      await supabase.from('crypto_wallets').insert({ profile_id: user.id, crypto: 'USDT', network: network || 'TRC20', wallet_address: value })
    }
  }

  revalidatePath('/admin')
  revalidatePath('/[username]', 'page')
  return { success: true }
}
