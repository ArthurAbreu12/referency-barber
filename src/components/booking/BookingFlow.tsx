'use client'

import { useEffect } from 'react'
import { useBookingStore } from '@/hooks/use-booking-store'
import BookingProgress from './BookingProgress'
import StepDateAndTime from './StepDateAndTime'
import StepBarber from './StepBarber'
import StepService from './StepService'
import StepCustomer from './StepCustomer'
import StepPaymentAndConfirm from './StepPaymentAndConfirm'

interface Service {
  id: string
  name: string
  description: string | null
  priceInCents: number
  durationMins: number
}

interface Barber {
  id: string
  name: string
  avatarUrl?: string | null
}

interface Props {
  services: Service[]
  barbers?: Barber[]
  barberId?: string
  preSelectedServiceId?: string
}

export default function BookingFlow({
  services,
  barbers = [],
  barberId = '',
  preSelectedServiceId,
}: Props) {
  const store = useBookingStore() as any
  const { step, setStep, setService, setBarber, barberId: selectedBarberId, barber } = store

  // Sincroniza o barbeiro vindo da URL (?barberId=3) com a Store Zustand
  useEffect(() => {
    if (barberId) {
      const foundBarber = barbers.find((b) => String(b.id) === String(barberId))
      const barberName = foundBarber ? foundBarber.name : ''
      
      if (setBarber) {
        setBarber(String(barberId), barberName)
      }
    }
  }, [barberId, barbers, setBarber])

  // Se veio serviço selecionado via URL
  useEffect(() => {
    if (!preSelectedServiceId) return
    const service = services.find((s) => s.id === preSelectedServiceId)
    if (service && setService) {
      setService(service.id, service.name, service.priceInCents, service.durationMins)
    }
  }, [preSelectedServiceId, services, setService])

  // Pega o ID ativo (Store > Barber Object > Props)
  const activeBarberId = String(selectedBarberId || barber?.id || barberId || '')

  return (
    <div className="rounded-2xl border border-rb-charcoal/10 bg-rb-surface p-6 shadow-sm sm:p-8">
      {/* Botão Voltar */}
      {step > 1 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white"
        >
          ← Voltar
        </button>
      )}

      <BookingProgress current={step} />

      {/* Passo 1: Seleção de Barbeiro */}
      {step === 1 && (
        <StepBarber
          barbers={barbers}
          onSelectBarber={(barberItem: any) => {
            const id = String(barberItem?.id ?? barberItem)
            const name = barberItem?.name ?? ''

            if (!id || id === 'undefined' || id === 'null') {
              console.error('ID de barbeiro inválido!')
              return
            }

            if (setBarber) {
              setBarber(id, name)
            }

            setStep(2)
          }}
        />
      )}

      {/* Passo 2: Seleção de Serviço */}
      {step === 2 && <StepService services={services} />}

      {/* Passo 3: Data & Hora */}
      {step === 3 && <StepDateAndTime barberId={activeBarberId} />}

      {/* Passo 4: Dados do Cliente */}
      {step === 4 && <StepCustomer />}

      {/* Passo 5: Pagamento e Confirmação */}
      {step === 5 && <StepPaymentAndConfirm barberId={activeBarberId} />}
    </div>
  )
}