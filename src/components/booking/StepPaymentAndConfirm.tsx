'use client'

import { useState } from 'react'
import { useBookingStore, PaymentMethod } from '@/hooks/use-booking-store'
import { formatCurrency } from '@/utils/format-currency'

const methods: { id: PaymentMethod; label: string; icon: string; description: string }[] = [
  { id: 'PIX', label: 'Pix', icon: '⚡', description: 'Aprovação na hora' },
  { id: 'CASH', label: 'Dinheiro', icon: '💵', description: 'Pague no local' },
]

export default function StepPaymentAndConfirm({ barberId }: { barberId?: string | number }) {
  const store = useBookingStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (iso: string) => {
    if (!iso) return ''
    return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })
  }

  const handleConfirm = async () => {
    if (!store.paymentMethod) return
    setLoading(true)
    setError(null)

    // 1. Pega o ID do barbeiro da store Zustand ou da Prop e garante que seja válido
    const rawBarberId = store.barberId || barberId
    const finalBarberId = rawBarberId ? Number(rawBarberId) : null

    if (!finalBarberId || isNaN(finalBarberId)) {
      setError('Selecione um barbeiro válido para continuar.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barberId: finalBarberId,
          serviceId: store.serviceId,
          appointmentDate: store.date,
          appointmentTime: store.time,
          customerName: store.customerName,
          customerWhatsApp: (store.customerWhatsApp || store.customerWhatsApp || '').replace(/\D/g, ''),
          paymentMethod: store.paymentMethod,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Erro ao criar agendamento no banco.')
        return
      }

      const bookingId = data.bookingId ?? data.booking?.id ?? data.id

      // Redirecionamentos para as rotas dentro da pasta /agendar
      if (store.paymentMethod === 'CASH') {
        window.location.href = `/agendar/sucesso?id=${bookingId}`
      } else {
        window.location.href = `/agendar/pagamento?id=${bookingId}`
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-[#29221d]">Como quer pagar?</h2>
      <p className="mb-6 text-[#665a50]">Confirme os dados e escolha a forma de pagamento.</p>

      {/* Resumo do Agendamento */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-[#29221d]/10 bg-[#f3efe8]/30">
        {[
          { label: 'Serviço', value: store.serviceName },
          { label: 'Data', value: store.date ? formatDate(store.date) : '' },
          { label: 'Horário', value: store.time },
          { label: 'Nome', value: store.customerName },
          { label: 'WhatsApp', value: store.customerWhatsApp || store.customerWhatsApp },
        ].map((row, i) => (
          <div key={row.label} className={`flex justify-between gap-4 px-5 py-3 ${i > 0 ? 'border-t border-[#29221d]/5' : ''}`}>
            <span className="text-sm text-[#665a50]">{row.label}</span>
            <span className="text-right text-sm font-semibold capitalize text-[#29221d]">{row.value || '—'}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-[#29221d]/10 bg-[#29221d]/5 px-5 py-4">
          <span className="font-semibold text-[#29221d]">Total</span>
          <span className="font-heading text-2xl font-bold text-[#29221d]">
            {store.servicePrice ? formatCurrency(store.servicePrice) : '—'}
          </span>
        </div>
      </div>

      {/* Opções de Pagamento */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {methods.map((m) => {
          const isSelected = store.paymentMethod === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => store.setPaymentMethod(m.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border py-4 transition-all ${
                isSelected
                  ? 'border-[#29221d] bg-[#29221d] text-white shadow-lg'
                  : 'border-[#29221d]/15 bg-white text-[#29221d] hover:border-[#29221d]/40'
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#29221d]'}`}>{m.label}</span>
              <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-[#665a50]'}`}>{m.description}</span>
            </button>
          )
        })}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => store.setStep(4)}
          disabled={loading}
          className="text-sm font-semibold text-[#665a50] underline-offset-4 hover:text-[#29221d] hover:underline"
        >
          ← Voltar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading || !store.paymentMethod}
          className="flex items-center gap-2 rounded-xl bg-[#8c7462] px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#735e4e] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          {loading ? 'Aguarde...' : 'Confirmar agendamento'}
        </button>
      </div>
    </div>
  )
}