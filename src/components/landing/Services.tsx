import Link from 'next/link'
import { supabase } from '@/lib/supabase-server'

// Interface para tipar os dados que vêm do banco
interface Service {
  id: number | string
  name: string
  description: string
  priceInCents: number
  durationMins: number
  popular?: boolean
  icon?: string
}

export default async function Services() {
  // 1. Busca os serviços do Supabase
  const { data: servicesData, error } = await supabase
    .from('Service')
    .select('*')
    .eq('isActive', true)
    .order('id', { ascending: true })

  if (error) {
    console.error('Erro ao buscar serviços:', error)
  }

  const services: Service[] = servicesData || []

  // Ícones padrão caso não estejam cadastrados na tabela
  const defaultIcons: Record<string, string> = {
    'Corte de Cabelo': '✂️',
    'Cabelo + Sobrancelha': '👁️',
    'Barba + Cabelo': '🪒',
    'Combo Completo': '⭐',
  }

  return (
    <section id="servicos" className="bg-rb-bg py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-rb-accent">
            O que oferecemos
          </span>
          <h2 className="font-heading text-4xl font-bold text-rb-charcoal">
            Nossos Serviços
          </h2>
          <p className="mx-auto mt-4 max-w-md text-rb-secondary">
            Escolha o serviço ideal para você. Preços fixos, sem surpresas.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            // Formata o preço de centavos para Reais (ex: 3500 -> R$ 35,00)
            const formattedPrice = (service.priceInCents / 100).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0,
            })

            const icon = service.icon || defaultIcons[service.name] || '✂️'

            return (
              <div
                key={service.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  service.popular
                    ? 'border-rb-accent bg-rb-charcoal text-rb-surface shadow-lg shadow-rb-accent/10'
                    : 'border-rb-charcoal/10 bg-rb-surface text-rb-charcoal hover:border-rb-accent/30'
                }`}
              >
                {service.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-rb-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-rb-surface">
                    Popular
                  </span>
                )}

                <div className="mb-4 text-3xl">{icon}</div>

                <h3
                  className={`mb-2 font-heading text-lg font-bold ${
                    service.popular ? 'text-rb-surface' : 'text-rb-charcoal'
                  }`}
                >
                  {service.name}
                </h3>

                <p
                  className={`mb-6 flex-1 text-sm leading-relaxed ${
                    service.popular ? 'text-rb-surface/60' : 'text-rb-secondary'
                  }`}
                >
                  {service.description}
                </p>

                <div className="mb-6 flex items-end justify-between">
                  <span
                    className={`font-heading text-3xl font-bold ${
                      service.popular ? 'text-rb-accent' : 'text-rb-charcoal'
                    }`}
                  >
                    {formattedPrice}
                  </span>
                  <span
                    className={`text-xs ${
                      service.popular ? 'text-rb-surface/40' : 'text-rb-secondary'
                    }`}
                  >
                    {service.durationMins} min
                  </span>
                </div>

                <Link
                  href={`/agendar?serviceId=${service.id}`}
                  className={`rounded-lg py-2.5 text-center text-sm font-semibold transition-all duration-200 ${
                    service.popular
                      ? 'bg-rb-accent text-rb-surface hover:bg-rb-surface hover:text-rb-charcoal'
                      : 'border border-rb-charcoal/20 text-rb-charcoal hover:border-rb-accent hover:text-rb-accent'
                  }`}
                >
                  Agendar
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}