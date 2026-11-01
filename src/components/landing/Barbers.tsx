import Link from 'next/link'

interface Barber {
  id: number
  name?: string | null
  role?: string | null
  bio?: string | null
  specialites?: string | null
}

export default function Barbers({ barbers }: { barbers: Barber[] }) {
  if (!barbers || barbers.length === 0) {
    return null
  }

  return (
    <section id="barbeiros" className="bg-rb-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-rb-accent">
            Quem são os nossos barbeiros?
          </span>
          <h2 className="font-heading text-4xl font-bold text-rb-charcoal">
            Nossa Equipe
          </h2>
          <p className="mx-auto mt-4 max-w-md text-rb-secondary">
            Experientes, dedicados e apaixonados pela arte da barbearia.
          </p>
        </div>

        {/* Cards dos Barbeiros */}
        <div className="flex flex-wrap justify-center gap-8">
          {barbers.map((barber) => {
            const displayName = barber.name ?? 'Barbeiro'
            const firstName = displayName.split(' ')[0]
            const specialtiesList = barber.specialites
              ? barber.specialites.split(',').map((s) => s.trim())
              : []

            return (
              <div
                key={barber.id}
                className="w-full max-w-sm overflow-hidden rounded-2xl bg-rb-charcoal shadow-xl"
              >
                {/* Avatar / Inicial */}
                <div className="flex h-72 items-center justify-center bg-rb-charcoal/80">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-rb-accent/20 ring-4 ring-rb-accent/30">
                    <span className="font-heading text-4xl font-bold text-rb-accent">
                      {displayName.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-rb-surface">
                    {displayName}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-rb-accent">
                    {barber.role ?? 'Barbeiro Profissional'}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-rb-surface/60">
                    {barber.bio}
                  </p>

                  {/* Especialidades */}
                  {specialtiesList.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {specialtiesList.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-rb-accent/30 bg-rb-accent/10 px-3 py-1 text-xs font-medium text-rb-accent"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/agendar?barberId=${barber.id}`}
                    className="mt-6 block rounded-lg bg-rb-accent py-3 text-center text-sm font-semibold text-rb-surface transition-all duration-200 hover:bg-rb-surface hover:text-rb-charcoal"
                  >
                    Agendar com {firstName}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}