'use client'

import { useState } from 'react'
import Image from 'next/image'
import localizacaoImg from '../../assets/localizacao.png'

const hours = [
  { day: 'Segunda', time: 'Fechado' },
  { day: 'Terça', time: '09:00 – 09:30 · 14:30 – 20:30' },
  { day: 'Quarta', time: '09:00 – 09:30 · 14:30 – 20:30' },
  { day: 'Quinta', time: '09:00 – 09:30 · 14:30 – 20:30' },
  { day: 'Sexta', time: '09:00 – 09:30 · 14:30 – 20:30' },
  { day: 'Sábado', time: '09:00 – 09:30 · 14:30 – 20:30' },
  { day: 'Domingo', time: 'Fechado' },
]

// Adicione aqui a lista de barbeiros/atendentes e respetivos números
const whatsappContacts = [
  { name: 'Andriel', number: '5551998149889', role: 'Cortes, barba e sobrancelha' },
  { name: 'Cleitinho', number: '5551996721084', role: 'Cortes, barba e sobrancelha' },
  { name: 'Xig', number: '5551999699245', role: 'Cortes, barba e sobrancelha' },
  { name: 'Lele', number: '5551994813753', role: 'Cortes, barba e sobrancelha' },
]

export default function Location() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section id="contato" className="bg-rb-charcoal py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-rb-accent">
            Onde estamos
          </span>
          <h2 className="font-heading text-4xl font-bold text-rb-surface">
            Localização & Horários
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Info */}
          <div className="space-y-8">
            {/* Address */}
            <div>
              <h3 className="mb-3 font-heading text-lg font-bold text-rb-surface">Endereço</h3>
              <p className="text-rb-surface/60">
                Rua Presidente Kennedy, 952 — São Luiz<br />
                Cidade, Estado — CEP 93806-336
              </p>
            </div>

            {/* Hours */}
            <div>
              <h3 className="mb-4 font-heading text-lg font-bold text-rb-surface">
                Horário de Funcionamento
              </h3>
              <ul className="space-y-2">
                {hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between border-b border-rb-surface/10 pb-2">
                    <span className="text-sm text-rb-surface/60">{h.day}</span>
                    <span
                      className={`text-sm font-medium ${
                        h.time === 'Fechado' ? 'text-rb-secondary' : 'text-rb-accent'
                      }`}
                    >
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* WhatsApp Selector */}
            <div className="relative inline-block text-left">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-3 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#20bd5c]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Fale pelo WhatsApp
                <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Menu Dropdown */}
              {isOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#222] p-2 shadow-xl ring-1 ring-white/10 z-50">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-rb-surface/40">
                    Escolha com quem falar:
                  </div>
                  {whatsappContacts.map((contact) => (
                    <a
                      key={contact.number}
                      href={`https://wa.me/${contact.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col rounded-lg px-3 py-2 text-sm hover:bg-white/5 transition-colors"
                    >
                      <span className="font-medium text-rb-surface">{contact.name}</span>
                      <span className="text-xs text-rb-surface/50">{contact.role}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map Image */}
          <div className="relative min-h-[350px] w-full overflow-hidden rounded-2xl bg-rb-surface/5 lg:h-full">
            <Image
              src={localizacaoImg}
              alt="Localização no mapa"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}