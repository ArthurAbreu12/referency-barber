'use client'

import { useState } from 'react'
import { useBookingStore } from '@/hooks/use-booking-store'

export default function StepCustomer() {
  const store = useBookingStore() as any
  const { customerName, customerWhatsApp, customerPhone, setCustomer, setStep } = store

  const [name, setName] = useState(customerName || '')
  const [whatsapp, setWhatsapp] = useState(customerWhatsApp || customerPhone || '')
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string }>({})

  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: { name?: string; whatsapp?: string } = {}

    if (name.trim().length < 2) {
      errs.name = 'Informe seu nome'
    }

    const digits = whatsapp.replace(/\D/g, '')
    if (digits.length < 10) {
      errs.whatsapp = 'WhatsApp inválido'
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    // 1. Salva os dados no Zustand
    if (setCustomer) {
      setCustomer(name.trim(), whatsapp.trim())
    }

    // 2. Avança para o Passo 5 (Pagamento / Confirmação)
    if (setStep) {
      setStep(5)
    }
  }

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-[#29221d]">Quase lá!</h2>
      <p className="mb-8 text-[#665a50]">Só precisamos de 2 informações para confirmar.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-[#29221d]">
            Seu nome
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="João Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#29221d]/10 ${
              errors.name
                ? 'border-red-400 bg-red-50'
                : 'border-[#29221d]/15 bg-[#f3efe8]/50 text-[#29221d] focus:border-[#29221d] focus:bg-white'
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-semibold text-[#29221d]">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            placeholder="(11) 99999-9999"
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
            className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[#29221d]/10 ${
              errors.whatsapp
                ? 'border-red-400 bg-red-50'
                : 'border-[#29221d]/15 bg-[#f3efe8]/50 text-[#29221d] focus:border-[#29221d] focus:bg-white'
            }`}
          />
          {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setStep && setStep(3)}
            className="text-sm font-semibold text-[#665a50] underline-offset-4 hover:text-[#29221d] hover:underline"
          >
            ← Voltar
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#8c7462] px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#735e4e] active:scale-95"
          >
            Continuar →
          </button>
        </div>
      </form>
    </div>
  )
}