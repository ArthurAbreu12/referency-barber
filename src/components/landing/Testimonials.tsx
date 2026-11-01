const testimonials = [
  {
    id: 1,
    name: 'Carlos Mendes',
    text: 'Melhor barbearia que já fui! O João sabe exatamente o que está fazendo. Saí com o corte perfeito.',
    rating: 5,
    date: 'Maio 2025',
  },
  {
    id: 2,
    name: 'Rafael Costa',
    text: 'Agendamento pelo site é super fácil e rápido. Atendimento pontual, sem espera. Recomendo!',
    rating: 5,
    date: 'Abril 2025',
  },
  {
    id: 3,
    name: 'Thiago Alves',
    text: 'Fiz o combo completo e valeu cada centavo. Barba bem feita, sobrancelha no capricho. Voltarei sempre.',
    rating: 5,
    date: 'Março 2025',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-rb-bg py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-rb-accent">
            O que dizem sobre nós
          </span>
          <h2 className="font-heading text-4xl font-bold text-rb-charcoal">
            Depoimentos
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-2xl border border-rb-charcoal/10 bg-rb-surface p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-rb-accent">★</span>
                ))}
              </div>

              <p className="flex-1 text-sm leading-relaxed text-rb-secondary">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rb-charcoal">
                    <span className="text-xs font-bold text-rb-surface">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-rb-charcoal">{t.name}</span>
                </div>
                <span className="text-xs text-rb-secondary">{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
