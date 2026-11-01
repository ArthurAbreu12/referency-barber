# Referency Barber — Instruções do Projeto

## Visão Geral

Site + sistema de agendamento com pagamento online para a barbearia **Referency Barber**. Stack: **Next.js 15 (App Router) + TypeScript + Tailwind + Supabase/Prisma + NextAuth v5 + Mercado Pago + Resend**.

## Segurança (Crítico)

- **Nunca armazene dados de cartão** — use MP Bricks (tokenização)
- **Preço sempre do servidor** — leia `Service.priceInCents` do DB, nunca do cliente
- **Valide webhooks** — HMAC-SHA256 antes de qualquer ação
- **Proteção de rotas admin** — 3 camadas: middleware → layout → Server Action
- **Sem SQL injection** — Prisma parametriza tudo
- **Headers de segurança** — CSP, HSTS, X-Frame-Options via next.config.ts

## Variáveis de Ambiente

Veja `.env.example`. Todas as chaves sensíveis (`MERCADOPAGO_ACCESS_TOKEN`, `NEXTAUTH_SECRET`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) **nunca** devem ter prefixo `NEXT_PUBLIC_`.

## Estrutura de Pastas

```
src/
├── app/               # Next.js App Router
├── components/        # React components (ui/, landing/, booking/, admin/, shared/)
├── lib/               # Utilities (prisma, auth, mercadopago, resend, rate-limit)
├── schemas/           # Zod schemas (server-side validation)
├── actions/           # Server Actions
├── hooks/             # Custom hooks (use-booking-store, use-availability)
├── types/             # TypeScript types (next-auth.d.ts)
└── utils/             # Helpers (format-currency, format-date, availability logic)
```

## Fases de Implementação

1. **Fase 0** — Bootstrap ✓ (create-next-app, Tailwind, Prisma, auth setup)
2. **Fase 1** — Auth (login/register, middleware, seed admin)
3. **Fase 2** — Landing Page (hero, serviços, barbeiros, localização, depoimentos)
4. **Fase 3** — Booking Flow (7 steps, API /availability, criação de booking)
5. **Fase 4** — Pagamento (MP Pix + cartão, webhook, polling)
6. **Fase 5** — E-mails (Resend templates, reminder job)
7. **Fase 6** — Admin Panel (dashboard, calendário, CRUD)
8. **Fase 7** — Hardening (rate limiting, LGPD deletion, audit)
9. **Fase 8** — Deploy (produção)

## Serviços Fixos e Preços

- **Corte de cabelo** — R$ 30 (3000 centavos)
- **Cabelo + Sobrancelha** — R$ 35 (3500 centavos)
- **Barba + Cabelo** — R$ 35 (3500 centavos)
- **Cabelo + Sobrancelha + Barba** — R$ 40 (4000 centavos)

**Pagamento**: 100% online (Pix ou cartão) OU cash no local.

## Como Executar

```bash
# Dev
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Configuração do Supabase

1. Crie projeto em [supabase.com](https://supabase.com)
2. Copie `DATABASE_URL` (pooler) e `DIRECT_URL` (direto) em `.env`
3. Execute `npx prisma migrate deploy` para criar tabelas

## Deploy na Vercel

1. Conecte repo ao Vercel
2. Configure variáveis de ambiente (copie de `.env`)
3. Deploy automático via git push

## Desenvolvimento Recomendado

- Use `TypeScript strict mode` (✓ ativado)
- Valide **todo** input com Zod (server-side)
- Prefira Server Components; use Client Components apenas quando necessário
- Não confie em dados do cliente — sempre valide + leia do DB
- Commit mensagens descritivas
