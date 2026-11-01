import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET() {
  try {
    const { data: barbers, error } = await supabase
      .from('Barber')
      .select('id, name, bio, specialites, isActive')
      .eq('isActive', true)

    if (error) {
      console.error('Erro Supabase:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Converte o ID número para String para não quebrar nos componentes
    const formattedBarbers = (barbers ?? []).map(b => ({
      ...b,
      id: String(b.id)
    }))

    return NextResponse.json(formattedBarbers)
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}