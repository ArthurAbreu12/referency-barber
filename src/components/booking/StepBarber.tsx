'use client'

import { useState, useEffect } from 'react'
import { useBookingStore } from '@/hooks/use-booking-store'

interface Barber {
  id: string
  name: string
  specialites?: string | null
  specialties?: string | null
  bio?: string | null
  description?: string | null
  avatarUrl?: string | null
}

interface StepBarberProps {
  barbers?: Barber[]
  onSelectBarber?: (barber: Barber) => void
}

export default function StepBarber({ barbers: initialBarbers = [], onSelectBarber }: StepBarberProps) {
  const [barbersList, setBarbersList] = useState<Barber[]>(initialBarbers)
  const [loading, setLoading] = useState(initialBarbers.length === 0)
  
  const store = useBookingStore() as any
  const { barberId, setBarber, setStep } = store

  useEffect(() => {
    if (initialBarbers.length > 0) {
      setBarbersList(initialBarbers)
      setLoading(false)
      return
    }

    // Caso não venham por props, busca da rota /api/barbers
    async function fetchBarbers() {
      try {
        const res = await fetch('/api/barbers')
        if (res.ok) {
          const data = await res.json()
          setBarbersList(data)
        }
      } catch (e) {
        console.error('Erro ao buscar barbeiros:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchBarbers()
  }, [initialBarbers])

  const handleSelect = (barber: Barber) => {
    if (setBarber) {
      setBarber(barber.id, barber.name)
    }

    if (onSelectBarber) {
      onSelectBarber(barber)
    } else if (setStep) {
      setStep(2)
    }
  }

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-rb-charcoal">
        Escolha o Barbeiro
      </h2>
      <p className="mb-8 text-rb-secondary">
        Selecione o profissional de sua preferência.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm font-medium text-rb-secondary animate-pulse">Carregando barbeiros...</p>
        </div>
      ) : barbersList.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm font-medium text-rb-secondary">Nenhum barbeiro disponível no momento.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {barbersList.map((barber) => {
            const isSelected = String(barberId) === String(barber.id)
            const initial = barber.name ? barber.name.charAt(0).toUpperCase() : 'B'
            const subtitle = barber.specialties || barber.specialites || barber.bio || barber.description || 'Barbeiro especialista'

            return (
              <button
                key={barber.id}
                type="button"
                onClick={() => handleSelect(barber)}
                className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                  isSelected
                    ? 'border-rb-accent bg-rb-charcoal shadow-lg'
                    : 'border-rb-charcoal/10 bg-rb-surface hover:border-rb-accent/40'
                }`}
              >
                {/* Avatar / Inicial */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-heading text-lg font-bold transition-colors ${
                    isSelected
                      ? 'bg-rb-accent text-rb-charcoal'
                      : 'bg-rb-charcoal/5 text-rb-accent'
                  }`}
                >
                  {barber.avatarUrl ? (
                    <img
                      src={barber.avatarUrl}
                      alt={barber.name}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>

                {/* Nome e Especialidades */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className={`font-heading text-base font-bold truncate ${
                      isSelected ? 'text-rb-surface' : 'text-rb-charcoal'
                    }`}
                  >
                    {barber.name}
                  </span>
                  <span
                    className={`text-sm truncate ${
                      isSelected ? 'text-rb-surface/60' : 'text-rb-secondary'
                    }`}
                  >
                    {subtitle}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}