import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const bookingId = Number(id) // converte a string da URL para número 

  if (isNaN(bookingId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  // busca na tabela usando a coluna 'id'
  const { data: booking, error: bookingError } = await supabase
    .from('Booking')
    .select('id, paymentMethod, status')
    .eq('id', bookingId) // 👈 Usa 'id'
    .single()

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
  }

  //  atualiza a tabela booking usando a coluna 'id'
  const { error: updateError } = await supabase
    .from('Booking')
    .update({ 
      status: 'CONFIRMED'
    })
    .eq('id', bookingId) // usa 'id'

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}