'use client'

const STEPS = [
  { number: 1, label: 'Barbeiro' },
  { number: 2, label: 'Serviço' },
  { number: 3, label: 'Data & Hora' },
  { number: 4, label: 'Dados' },
  { number: 5, label: 'Pagamento' },
]

export default function BookingProgress({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-between px-2">
      {STEPS.map((step, idx) => {
        const isDone = current > step.number
        const isCurrent = current === step.number

        return (
          <div key={step.number} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5 w-full">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-[#29221d] text-[#f3efe8]'
                    : isCurrent
                    ? 'bg-[#29221d] text-[#f3efe8] ring-4 ring-[#29221d]/15'
                    : 'bg-rb-charcoal/10 text-rb-charcoal/40'
                }`}
              >
                {isDone ? '✓' : step.number}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold ${
                  isCurrent || isDone ? 'text-[#29221d] font-bold' : 'text-rb-secondary/60'
                }`}
              >
                {step.label}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div
                className={`h-[2px] w-full max-w-[40px] sm:max-w-[80px] -mt-5 transition-colors ${
                  current > step.number ? 'bg-[#29221d]' : 'bg-rb-charcoal/10'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}