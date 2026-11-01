import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
})

export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const topic = url.searchParams.get('topic') || url.searchParams.get('type')
    
    if (topic === 'payment') {
      const body = await req.json()
      const paymentId = body.data?.id || url.searchParams.get('data.id')

      if (paymentId) {
        const payment = new Payment(client)
        const paymentData = await payment.get({ id: paymentId })

        if (paymentData.status === 'approved') {
          const bookingId = paymentData.external_reference

          if (bookingId) {
            // Atualiza o status do agendamento no banco de dados para CONFIRMED
            await prisma.booking.update({
              where: { id: bookingId },
              data: { status: 'CONFIRMED' },
            })
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro no Webhook do Mercado Pago:', error)
    return NextResponse.json({ error: 'Erro no webhook' }, { status: 500 })
  }
}