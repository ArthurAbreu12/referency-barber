import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase-server'
import PaymentClient from './PaymentClient'
import { formatCurrency } from '@/utils/format-currency'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ id?: string }>
}

export default async function PaymentPage({ searchParams }: Props) {
  const { id } = await searchParams

  if (!id) notFound()

  // id no Supabase é int8 (número)
  const numericId = Number(id)
  if (isNaN(numericId)) notFound()

  // 1. Busca o agendamento
  const { data: booking, error: bookingError } = await supabase
    .from('Booking')
    .select('id, paymentMethod, appointmentDate, appointmentTime, customerName, serviceId, barberId')
    .eq('id', numericId)
    .single()

  if (bookingError || !booking) {
    console.error('ERRO AGENDAMENTO:', bookingError?.message)
    notFound()
  }

  // 2. Busca o serviço e o barbeiro (puxando a coluna pixKey)
  const [{ data: service }, { data: barber }] = await Promise.all([
    supabase.from('Service').select('name, priceInCents').eq('id', String(booking.serviceId)).single(),
    supabase.from('Barber').select('name, pixKey').eq('id', booking.barberId).single(),
  ])

  // Preço obtido da tabela Service
  const amountInCents = service?.priceInCents ?? 0

  // Formatação legível de data (ex: 2026-10-06 -> terça-feira, 06 de outubro)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr
    if (!datePart) return dateStr

    const parts = datePart.split('-')
    if (parts.length < 3) return dateStr

    const year = Number(parts[0])
    const month = Number(parts[1]) - 1
    const day = Number(parts[2])

    return new Date(year, month, day).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })
  }

  return (
    <main className="min-h-screen bg-rb-bg py-12">
      <div className="mx-auto max-w-lg px-6">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-4 inline-block font-heading text-sm font-bold uppercase tracking-widest text-rb-accent"
          >
            ← Referency Barber
          </Link>
          <h1 className="font-heading text-2xl font-bold text-rb-charcoal">Pagamento</h1>
        </div>

        {/* Resumo do Agendamento */}
        <div className="mb-6 rounded-2xl border border-rb-charcoal/10 bg-rb-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading font-bold text-rb-charcoal">
                {service?.name ?? 'Serviço'}
              </p>
              <p className="text-sm text-rb-secondary">
                {barber?.name ?? 'Barbeiro'} · {formatDate(booking.appointmentDate)} às {booking.appointmentTime}
              </p>
            </div>
            <span className="font-heading text-2xl font-bold text-rb-accent">
              {formatCurrency(amountInCents)}
            </span>
          </div>
        </div>

        <PaymentClient
          bookingId={String(booking.id)}
          paymentMethod={booking.paymentMethod}
          amountInCents={amountInCents}
          customerName={booking.customerName}
          pixKey={barber?.pixKey}
        />
      </div>
    </main>
  )
}