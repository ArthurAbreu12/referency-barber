import Link from 'next/link'
import Image from 'next/image'
import logoImg from '../../assets/logo.jpeg'

export default function Footer() {
  return (
    <footer className="bg-rb-charcoal border-t border-rb-surface/10">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Image
              src={logoImg}
              alt="Referency Barber"
              className="h-10 w-auto object-contain"
            />
            <p className="mt-3 text-sm leading-relaxed text-rb-surface/50">
              Barbearia premium com agendamento online. Qualidade e precisão em cada corte.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-rb-surface/40">
              Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: '#servicos', label: 'Serviços' },
                { href: '#barbeiros', label: 'Barbeiros' },
                { href: '#contato', label: 'Contato' },
                { href: '/agendar', label: 'Agendar' },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-rb-surface/50 transition-colors hover:text-rb-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-rb-surface/10 pt-8 text-xs text-rb-surface/30 sm:flex-row">
          <p>© {new Date().getFullYear()} Referency Barber. Todos os direitos reservados.</p>
          <Link href="/privacidade" className="transition-colors hover:text-rb-accent">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  )
}