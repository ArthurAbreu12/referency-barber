import Link from 'next/link'
import { supabase } from '@/lib/supabase-server'
import BookingFlow from '@/components/booking/BookingFlow'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ serviceId?: string; barberId?: string }>
}

export default async function AgendarPage({ searchParams }: Props) {
  const { serviceId, barberId: urlBarberId } = await searchParams

  const [
    { data: services, error: servicesError },
    { data: barbers, error: barbersError }
  ] = await Promise.all([
    supabase
      .from('Service')
      .select('id, name, description, priceInCents, durationMins')
      .eq('isActive', true)
      .order('displayOrder', { ascending: true }),

    supabase
      .from('Barber')
      .select('id')
      .eq('isActive', true)
  ])

  if (servicesError) console.error('ERRO SERVIÇOS:', servicesError.message)
  if (barbersError) console.error('ERRO BARBEIROS:', barbersError.message)

  // Se veio na URL usa o da URL, senão passa string vazia para forçar o passo de seleção no fluxo
  const selectedBarberId = urlBarberId ?? ''

  return (
    <main className="min-h-screen bg-rb-bg py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-10 text-center">
          <Link     
            href="/" 
            className="mb-4 inline-block font-heading text-sm font-bold uppercase tracking-widest text-rb-accent"
          >
            ← Referency Barber
          </Link>
          <h1 className="font-heading text-3xl font-bold text-rb-charcoal">Agendar Atendimento</h1>
          <p className="mt-2 text-rb-secondary">Rápido, fácil e sem complicação.</p>
        </div>

        <BookingFlow 
          services={services ?? []} 
          barberId={selectedBarberId} 
          preSelectedServiceId={serviceId} 
        />
      </div>
    </main>
  )
}