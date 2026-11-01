import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET() {
  // Try both casing variants
  const upper = await supabase.from('Service').select('*')
  const lower = await supabase.from('service').select('*')

  // List all tables in public schema
  const tables = await supabase.rpc('get_tables')

  return NextResponse.json({
    'Service (uppercase)': { data: upper.data, error: upper.error?.message },
    'service (lowercase)': { data: lower.data, error: lower.error?.message },
    tables: tables.data,
  })
}
