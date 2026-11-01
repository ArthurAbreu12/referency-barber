'use client'

import { create } from 'zustand'

export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'CASH'

export interface BookingState {
  step: number
  // Step 1 — service
  serviceId: string | null
  serviceName: string | null
  servicePrice: number | null
  serviceDuration: number | null
  // Step 2 — barber
  barberId: string | null
  barberName: string | null
  // Step 3 — date + time
  date: string | null   // YYYY-MM-DD
  time: string | null   // HH:MM
  // Step 4 — customer
  customerName: string
  customerWhatsApp: string
  // Step 5 — payment
  paymentMethod: PaymentMethod | null

  setStep: (step: number) => void
  setService: (id: string, name: string, price: number, duration: number) => void
  setBarber: (id: string, name?: string) => void
  setDate: (date: string) => void
  setTime: (time: string) => void
  setCustomer: (name: string, whatsapp: string) => void
  setPaymentMethod: (method: PaymentMethod) => void
  reset: () => void
}

const initial = {
  step: 1,
  serviceId: null,
  serviceName: null,
  servicePrice: null,
  serviceDuration: null,
  barberId: null,
  barberName: null,
  date: null,
  time: null,
  customerName: '',
  customerWhatsApp: '',
  paymentMethod: null,
}

export const useBookingStore = create<BookingState>((set) => ({
  ...initial,
  setStep: (step) => set({ step }),
  setService: (id, name, price, duration) =>
    set({ serviceId: id, serviceName: name, servicePrice: price, serviceDuration: duration }),
  setBarber: (id, name) => set({ barberId: id, barberName: name || null }),
  setDate: (date) => set({ date, time: null }),
  setTime: (time) => set({ time }),
  setCustomer: (name, whatsapp) =>
    set({ customerName: name, customerWhatsApp: whatsapp }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  reset: () => set(initial),
}))