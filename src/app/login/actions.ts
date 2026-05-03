'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect('/login?message=No se pudo iniciar sesión: Credenciales inválidas')
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const artistName = formData.get('artist_name') as string

  if (!email || !password || !username || !artistName) {
    return redirect('/login?message=Todos los campos son obligatorios&tab=register')
  }

  // Comprobar si el username ya existe en profiles
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  if (existingUser) {
    return redirect('/login?message=Ese nombre de usuario (URL) ya está en uso&tab=register')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=Error en registro: ' + error.message + '&tab=register')
  }

  if (data.user) {
    // Insertar en la tabla profiles
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: username.toLowerCase().trim().replace(/\s+/g, '-'),
      artist_name: artistName,
    })

    if (profileError) {
      console.error(profileError)
      return redirect('/login?message=Cuenta creada, pero hubo un error al crear el perfil&tab=register')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
