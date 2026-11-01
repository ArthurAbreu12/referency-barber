import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const bookingIdNum = Number(id) 

  if (isNaN(bookingIdNum)) {
    return NextResponse.json({ status: 'PENDING' })
  }

  // Busca na tabela Payment filtrando pela chave estrangeira 'bookingId'
  const { data: payment } = await supabase
    .from('Payment')
    .select('status')
    .eq('bookingId', bookingIdNum) //passa o ID convertido como número
    .maybeSingle()

  return NextResponse.json({ status: payment?.status ?? 'PENDING' })
}