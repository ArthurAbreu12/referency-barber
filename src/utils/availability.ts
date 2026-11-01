export function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMins: number,
  breakStart?: string | null,
  breakEnd?: string | null,
): string[] {
  const slots: string[] = []

  const toMins = (hhmm: string) => {
    const parts = hhmm.split(':').map(Number)
    return (parts[0] ?? 0) * 60 + (parts[1] ?? 0)
  }

  const toHHMM = (mins: number) => {
    const h = Math.floor(mins / 60).toString().padStart(2, '0')
    const m = (mins % 60).toString().padStart(2, '0')
    return `${h}:${m}`
  }

  const start = toMins(startTime)
  const end = toMins(endTime)
  const bStart = breakStart ? toMins(breakStart) : null
  const bEnd = breakEnd ? toMins(breakEnd) : null

  for (let t = start; t + durationMins <= end; t += durationMins) {
    if (bStart !== null && bEnd !== null) {
      // Skip slots that overlap with break
      if (t < bEnd && t + durationMins > bStart) continue
    }
    slots.push(toHHMM(t))
  }

  return slots
}
