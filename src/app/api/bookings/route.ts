import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { z } from 'zod'

// Schema com validação estrita de tipos e sanitização de WhatsApp (apenas números)
const bookingSchema = z.object({
  serviceId: z.coerce.number({ message: 'serviceId precisa ser um número' }),
  barberId: z.coerce.number({ message: 'barberId precisa ser um número' }),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (AAAA-MM-DD)'),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  customerName: z.string().min(2).max(100),
  customerWhatsApp: z
    .string()
    .transform((val) => val.replace(/\D/g, '')) // Remove parênteses, traços e espaços
    .refine((val) => val.length >= 10 && val.length <= 11, {
      message: 'O WhatsApp deve conter entre 10 e 11 dígitos numéricos',
    }),
  paymentMethod: z.enum(['PIX', 'CASH']),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 })
  }

  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    console.log('❌ ERRO DE VALIDAÇÃO ZOD:', JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
    return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten().fieldErrors }, { status: 422 })
  }

  const {
    serviceId,
    barberId,
    appointmentDate,
    appointmentTime,
    customerName,
    customerWhatsApp,
    paymentMethod,
  } = parsed.data

  // 1. Verifica se o serviço existe e está ativo no banco
  const { data: service, error: serviceError } = await supabase
    .from('Service')
    .select('id, isActive')
    .eq('id', serviceId)
    .single()

  if (serviceError || !service?.isActive) {
    return NextResponse.json({ error: 'Serviço não encontrado ou inativo.' }, { status: 404 })
  }

  // 2. Verifica se já existe um agendamento no mesmo horário para o mesmo barbeiro
  const { data: conflict } = await supabase
    .from('Booking')
    .select('id')
    .eq('barberId', barberId)
    .eq('appointmentDate', appointmentDate)
    .eq('appointmentTime', appointmentTime)
    .not('status', 'in', '("CANCELLED","NO_SHOW")')
    .maybeSingle()

  if (conflict) {
    return NextResponse.json({ error: 'Horário indisponível. Escolha outro.' }, { status: 409 })
  }

  const status = paymentMethod === 'CASH' ? 'CONFIRMED' : 'PENDING'

  // 3. Insere na tabela Booking enviando apenas números para a coluna customerWhatsApp
  const { data: booking, error } = await supabase
    .from('Booking')
    .insert({
      barberId,
      serviceId,
      appointmentDate,
      appointmentTime,
      status,
      paymentMethod,
      customerName: customerName.trim(),
      customerWhatsApp: customerWhatsApp.replace(/\D/g, ''), // Garante apenas números
    })
    .select('id')
    .single()

  if (error || !booking) {
    console.error('❌ ERRO AO INSERIR NO SUPABASE:', error)
    return NextResponse.json({ error: 'Erro ao criar agendamento no banco.' }, { status: 500 })
  }

  return NextResponse.json({ bookingId: booking.id, booking }, { status: 201 })
}