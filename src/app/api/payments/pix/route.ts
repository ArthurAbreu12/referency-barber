import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
})

export async function POST(req: Request) {
  try {
    const { bookingId, amount, email, description } = await req.json()

    const payment = new Payment(client)

    const response = await payment.create({
      body: {
        transaction_amount: amount,
        description: description || `Agendamento #${bookingId}`,
        payment_method_id: 'pix',
        payer: {
          email: email || 'cliente@referencybarber.com.br',
        },
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
        external_reference: bookingId,
      },
    })

    return NextResponse.json({
      qrCode: response.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: response.point_of_interaction?.transaction_data?.qr_code_base64,
      paymentId: response.id,
    })
  } catch (error) {
    console.error('Erro ao gerar Pix no Mercado Pago:', error)
    return NextResponse.json({ error: 'Erro ao gerar pagamento' }, { status: 500 })
  }
}