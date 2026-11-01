'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/utils/format-currency'
import { generatePixPayload } from '@/utils/generate-pix'

interface Props {
  bookingId: string
  amountInCents: number
  pixKey?: string | null
}

export default function PixPayment({ bookingId, amountInCents, pixKey }: Props) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<'PENDING' | 'PAID' | 'CONFIRMED'>('PENDING')

  // 1. Gera o código Pix no padrão BR Code oficial do Banco Central
  const pixPayload = useMemo(() => {
    const rawKey = pixKey || '00000000000'

    try {
      return generatePixPayload({
        pixKey: rawKey,
        merchantName: 'Referency Barber',
        merchantCity: 'Sapiranga',
        amountInCents,
        txid: `REF${bookingId.slice(-5)}`,
      })
    } catch (err) {
      console.error('Erro ao gerar Payload Pix:', err)
      return rawKey
    }
  }, [pixKey, amountInCents, bookingId])

  // 2. Gera o QR Code com a string completa do Pix BR Code
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixPayload)}`

  // 3. Polling automático: verifica a cada 3 segundos se o agendamento foi pago
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`)
        if (res.ok) {
          const data = await res.json()
          // Se o webhook da sua API ou o banco atualizar o status para pago/confirmado
          if (data.status === 'PAID' || data.status === 'CONFIRMED') {
            setStatus(data.status)
            router.push(`/agendar/sucesso?id=${bookingId}`)
          }
        }
      } catch (err) {
        console.error('Erro ao verificar pagamento:', err)
      }
    }

    // Executa a primeira verificação e inicia o intervalo
    checkPaymentStatus()
    const interval = setInterval(checkPaymentStatus, 3000)

    return () => clearInterval(interval)
  }, [bookingId, router])

  const copyKey = () => {
    navigator.clipboard.writeText(pixPayload)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-rb-charcoal/10 bg-rb-surface p-6">
        <h2 className="mb-1 font-heading text-lg font-bold text-rb-charcoal">Pagar com Pix</h2>
        <p className="mb-6 text-sm text-rb-secondary">
          Escaneie o QR Code ou copie a chave Pix abaixo. O pagamento é confirmado em segundos.
        </p>

        {/* QR Code */}
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="rounded-xl border-4 border-rb-charcoal/10 bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="QR Code Pix"
              width={200}
              height={200}
              className="block"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-rb-secondary">
              Aguardando confirmação do pagamento...
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-4 flex items-center justify-between rounded-xl bg-rb-bg px-4 py-3">
          <span className="text-sm text-rb-secondary">Valor</span>
          <span className="font-heading text-xl font-bold text-rb-charcoal">
            {formatCurrency(amountInCents)}
          </span>
        </div>

        {/* Copy key */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-rb-secondary">
            Código Pix Copia e Cola
          </p>
          <div className="flex gap-2">
            <div className="flex-1 truncate rounded-lg border border-rb-charcoal/10 bg-rb-bg px-3 py-2.5 font-mono text-xs text-rb-secondary">
              {pixPayload}
            </div>
            <button
              onClick={copyKey}
              className="shrink-0 rounded-lg bg-rb-charcoal px-4 py-2.5 text-xs font-semibold text-rb-surface transition-all hover:bg-rb-accent"
            >
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Steps */}
        <ol className="space-y-1.5 text-sm text-rb-secondary">
          {[
            'Abra o app do seu banco',
            'Escolha "Pagar com Pix / Copia e Cola"',
            'Escaneie o QR Code ou cole o código gerado',
            'Confirme o pagamento',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rb-accent/10 text-xs font-bold text-rb-accent">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}