'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const links = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#contato', label: 'Contato' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-rb-charcoal/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://i.ibb.co/v6g1xjjW/Whats-App-Image-2026-05-31-at-1-10-24-PM.jpg"
            alt="Referency Barber"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium tracking-wide text-rb-surface/80 transition-colors hover:text-rb-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>


        {/* Mobile burger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <span className={`block h-0.5 w-6 bg-rb-surface transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-rb-surface transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-rb-surface transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-rb-surface/10 bg-rb-charcoal px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-base font-medium text-rb-surface/80 transition-colors hover:text-rb-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
