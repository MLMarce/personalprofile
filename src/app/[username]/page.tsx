import { supabase } from "@/lib/supabase";
import { Hero } from "@/components/Hero";
import { ServicesGrid, Service } from "@/components/ServicesGrid";
import { PaymentMethods, PaymentMethod } from "@/components/PaymentMethods";
import { FloatingContact } from "@/components/FloatingContact";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

// For Next.js 15, params is a Promise
interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { username } = await params;

  const { data: profile } = await supabase
    .from('profiles')
    .select('artist_name, bio, avatar_url')
    .eq('username', username)
    .single();

  const title = profile?.artist_name ? `${profile.artist_name} | Perfil Premium` : `@${username} | Perfil Premium`;
  const description = profile?.bio || "Descubre mi contenido exclusivo y servicios personalizados.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: profile?.avatar_url ? [profile.avatar_url] : ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"],
    },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  // 1. Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_active', true)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const profileId = profile.id;

  // 2. Fetch Services
  const { data: servicesData } = await supabase
    .from('services')
    .select('*, service_variants(*)')
    .eq('profile_id', profileId)
    .eq('is_active', true);

  const services: Service[] = servicesData || [];

  // 3. Fetch Payment Methods (Fiat & Crypto)
  const { data: fiatMethods } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('profile_id', profileId);

  const { data: cryptoMethods } = await supabase
    .from('crypto_wallets')
    .select('*')
    .eq('profile_id', profileId);

  // Normalize payments to our UI structure
  const allPaymentMethods: PaymentMethod[] = [];
  
  if (fiatMethods) {
    fiatMethods.forEach(method => {
      if (method.type === 'mercadopago' && method.mp_alias) {
        allPaymentMethods.push({
          id: method.id,
          type: 'mercadopago',
          label: 'Mercado Pago',
          value: method.mp_alias
        });
      }
      if (method.type === 'paypal' && method.paypal_email) {
        allPaymentMethods.push({
          id: method.id,
          type: 'paypal',
          label: 'PayPal',
          value: method.paypal_email
        });
      }
    });
  }

  if (cryptoMethods) {
    cryptoMethods.forEach(method => {
      allPaymentMethods.push({
        id: method.id,
        type: 'crypto',
        label: method.crypto,
        value: method.wallet_address,
        network: method.network
      });
    });
  }

  // 4. Fetch Social Links
  const { data: socialLinksData } = await supabase
    .from('social_links')
    .select('*')
    .eq('profile_id', profileId);

  return (
    <main className="min-h-screen pb-20">
      <Hero 
        name={profile.artist_name}
        bio={profile.bio}
        avatarUrl={profile.avatar_url}
        telegramUrl={profile.telegram_username ? `https://t.me/${profile.telegram_username}` : undefined}
        socialLinks={socialLinksData || []}
      />
      
      <ServicesGrid 
        services={services}
        telegramUrl={profile.telegram_username ? `https://t.me/${profile.telegram_username}` : undefined}
      />
      
      {allPaymentMethods.length > 0 && (
        <PaymentMethods methods={allPaymentMethods} />
      )}

      {profile.telegram_username && (
        <FloatingContact telegramUrl={`https://t.me/${profile.telegram_username}`} />
      )}
    </main>
  );
}
