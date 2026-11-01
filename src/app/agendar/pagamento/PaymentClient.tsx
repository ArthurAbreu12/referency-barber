'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import PixPayment from './PixPayment'

interface Props {
  bookingId: string
  paymentMethod: string
  amountInCents: number
  customerName: string
  pixKey?: string | null
}

export default function PaymentClient({
  bookingId,
  paymentMethod,
  amountInCents,
  customerName,
  pixKey,
}: Props) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')

  const pollStatus = useCallback(async () => {
    const res = await fetch(`/api/bookings/${bookingId}/payment-status`)
    const data = await res.json()
    if (data.status === 'APPROVED') {
      setStatus('approved')
    } else if (data.status === 'REJECTED') {
      setStatus('rejected')
    }
  }, [bookingId])

  useEffect(() => {
    if (status !== 'pending') return
    const interval = setInterval(pollStatus, 3000)
    return () => clearInterval(interval)
  }, [status, pollStatus])

  if (status === 'approved') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="font-heading text-xl font-bold text-green-800">Pagamento confirmado!</h2>
        <p className="mt-2 text-sm text-green-600">Seu agendamento está confirmado. Até logo!</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-rb-charcoal px-8 py-3 text-sm font-semibold text-rb-surface transition-all hover:bg-rb-accent"
        >
          Voltar ao início
        </Link>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">✗</span>
        </div>
        <h2 className="font-heading text-xl font-bold text-red-800">Pagamento recusado</h2>
        <p className="mt-2 text-sm text-red-600">Tente novamente ou escolha outra forma de pagamento.</p>
        <a
          href={`/agendar/pagamento?id=${bookingId}`}
          className="mt-6 inline-block rounded-xl bg-rb-charcoal px-8 py-3 text-sm font-semibold text-rb-surface"
        >
          Tentar novamente
        </a>
      </div>
    )
  }

  return (
    <>
      {paymentMethod === 'PIX' && (
        <PixPayment
          bookingId={bookingId}
          amountInCents={amountInCents}
          pixKey={pixKey}
        />
      )}
    </>
  )
}