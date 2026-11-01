'use client'

import { useBookingStore } from '@/hooks/use-booking-store'
import { formatCurrency } from '@/utils/format-currency'

interface Service {
  id: string
  name: string
  description: string | null
  priceInCents: number
  durationMins: number
}

export default function StepService({ services }: { services: Service[] }) {
  const { serviceId, setService, setStep } = useBookingStore()

  const handleSelectService = (s: Service) => {
    // 1. Guarda o serviço selecionado no Zustand
    setService(s.id, s.name, s.priceInCents, s.durationMins)
    // 2. FORÇA a ir para o Passo 3(Data e Hora ) 
    setStep(3)
  }

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-rb-charcoal">Qual serviço?</h2>
      <p className="mb-8 text-rb-secondary">Escolha o serviço desejado para continuar o agendamento.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handleSelectService(s)}
            className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
              serviceId === s.id
                ? 'border-rb-accent bg-rb-charcoal shadow-lg'
                : 'border-rb-charcoal/10 bg-rb-surface hover:border-rb-accent/40'
            }`}
          >
            <span className={`mb-1 font-heading text-base font-bold ${serviceId === s.id ? 'text-rb-surface' : 'text-rb-charcoal'}`}>
              {s.name}
            </span>
            {s.description && (
              <span className={`mb-4 text-sm leading-relaxed ${serviceId === s.id ? 'text-rb-surface/60' : 'text-rb-secondary'}`}>
                {s.description}
              </span>
            )}
            <div className="mt-auto flex w-full items-end justify-between pt-2">
              <span className={`font-heading text-2xl font-bold ${serviceId === s.id ? 'text-rb-accent' : 'text-rb-charcoal'}`}>
                {formatCurrency(s.priceInCents)}
              </span>
              <span className={`text-xs ${serviceId === s.id ? 'text-rb-surface/40' : 'text-rb-secondary'}`}>
                ~{s.durationMins} min
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}