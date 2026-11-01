import Link from 'next/link'


export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-rb-bg px-6 text-center">
      <div className="max-w-md">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rb-accent/10 mx-auto">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-rb-charcoal">Agendamento confirmado!</h1>
        <p className="mt-4 text-rb-secondary">
          Seu agendamento foi realizado com sucesso. Você pagará no local no dia do atendimento.
          Anote o horário e não se atrase!
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-rb-charcoal px-8 py-3 text-sm font-semibold text-rb-surface transition-all hover:bg-rb-accent"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
