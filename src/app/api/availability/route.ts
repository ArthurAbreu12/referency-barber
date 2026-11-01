import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { generateTimeSlots } from '@/utils/availability'
import { z } from 'zod'

const querySchema = z.object({
  barberId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationMins: z.coerce.number().int().min(15).max(180),
})

const DAY_MAP: Record<number, string> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
}

// Função auxiliar para garantir formato "HH:MM"
function formatTime(timeStr?: string | null) {
  if (!timeStr) return null
  return timeStr.slice(0, 5)
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const parsed = querySchema.safeParse({
    barberId: searchParams.get('barberId'),
    date: searchParams.get('date'),
    durationMins: searchParams.get('durationMins'),
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
  }

  const { barberId: rawBarberId, date, durationMins } = parsed.data
  const barberId = Number(rawBarberId)

  const parts = date.split('-').map(Number)
  const jsDate = new Date(parts[0] ?? 0, (parts[1] ?? 1) - 1, parts[2] ?? 1)
  const dayOfWeek = DAY_MAP[jsDate.getDay()]

  // 1. Data e Hora no fuso horário do Brasil (America/Sao_Paulo)
  const now = new Date()
  const brazilDateStr = now.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' })
  const brazilTimeStr = now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour12: false })

  const isToday = date === brazilDateStr
  const [currentHour = 0, currentMinute = 0] = brazilTimeStr.split(':').map(Number)

  // 2. Busca agendamentos confirmados/pagos
  const { data: bookings } = await supabase
    .from('Booking')
    .select('appointmentTime')
    .eq('barberId', barberId)
    .eq('appointmentDate', date)
    .in('status', ['CONFIRMED', 'PAID'])

  const bookedTimes = new Set(
    (bookings ?? []).map((b: { appointmentTime: string }) => formatTime(b.appointmentTime)!)
  )

  // 3. Busca bloqueios pontuais de horários na data
  const { data: blockedSlots } = await supabase
    .from('BlockedSlot')
    .select('startTime, endTime')
    .eq('barberId', barberId)
    .eq('date', date)

  const fullDayBlocked = (blockedSlots ?? []).some(
    (b: { startTime: string | null; endTime: string | null }) => !b.startTime && !b.endTime
  )

  const blockedTimes = new Set(
    (blockedSlots ?? [])
      .filter((b: { startTime: string | null }) => b.startTime)
      .map((b: { startTime: string | null }) => formatTime(b.startTime)!)
  )

  // 4. Busca a agenda do barbeiro
  const { data: schedule } = await supabase
    .from('Schedule')
    .select('startTime, endTime, breakStart, breakEnd, isActive')
    .eq('barberId', barberId)
    .eq('dayOfWeek', dayOfWeek)
    .maybeSingle()

  const pastTimes = new Set<string>()

  if (schedule && schedule.isActive) {
    const startTime = formatTime(schedule.startTime)!
    const endTime = formatTime(schedule.endTime)!
    const breakStart = formatTime(schedule.breakStart)
    const breakEnd = formatTime(schedule.breakEnd)

    const rawSlots = generateTimeSlots(startTime, endTime, durationMins, breakStart, breakEnd)
    const allSlots = rawSlots.map((s) => formatTime(s)!)

    if (isToday) {
      allSlots.forEach((slot) => {
        const [slotHours = 0, slotMinutes = 0] = slot.split(':').map(Number)

        if (slotHours < currentHour || (slotHours === currentHour && slotMinutes <= currentMinute)) {
          pastTimes.add(slot)
        }
      })
    }

    const allOccupiedTimes = Array.from(new Set([...bookedTimes, ...blockedTimes, ...pastTimes]))

    if (fullDayBlocked) {
      return NextResponse.json({ slots: [], bookedSlots: allOccupiedTimes })
    }

    const availableSlots = allSlots.filter((slot) => !allOccupiedTimes.includes(slot))

    return NextResponse.json({
      slots: availableSlots,
      bookedSlots: allOccupiedTimes,
    })
  }

  // Se não houver Schedule cadastrado ou o dia for inativo para este barbeiro
  return NextResponse.json({ slots: [], bookedSlots: Array.from(pastTimes) })
}