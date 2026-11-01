# Roadmap — Referency Barber

## ✅ Concluído

### Fase 0 — Bootstrap
- [x] Next.js 15 + TypeScript + Tailwind CSS v4
- [x] Prisma schema completo (User, Barber, Service, Booking, Payment, Schedule)
- [x] Configuração NextAuth v4
- [x] Variáveis de ambiente documentadas (`.env.example`)

### Fase 2 — Landing Page
- [x] Navbar com scroll + menu mobile
- [x] Hero com CTA
- [x] Seção de Serviços com preços
- [x] Seção de Localização e Horários
- [x] Footer com logo e links
- [x] Design system (cores, fontes Montserrat + Inter)

### Fase 3 — Booking Flow
- [x] Fluxo simplificado em 4 passos (serviço → data/hora → dados → pagamento)
- [x] Calendário com dom/seg bloqueados
- [x] Slots de 30 em 30 min (09:00–21:30)
- [x] Validação de conflitos no servidor
- [x] Formulário reduzido (só nome + WhatsApp)
- [x] API `/api/availability` (verifica horários ocupados)
- [x] API `/api/bookings` (cria agendamento, preço sempre do DB)

### Fase 4 — Pagamento (Demo)
- [x] Tela de pagamento Pix com QR Code mockado
- [x] Tela de pagamento Cartão com preview animado
- [x] Endpoint de simulação de pagamento (`/api/bookings/[id]/simulate-payment`)
- [x] Polling de status a cada 3s

---

## 🚧 Pendente

### Fase 1 — Autenticação Admin
- [ ] Página de login (`/login`)
- [ ] Proteção de rotas admin via middleware
- [ ] Seed de usuário admin no banco

### Fase 4 — Pagamento Real (Mercado Pago)
- [ ] Obter credenciais do Mercado Pago (conta MP → Credenciais)
- [ ] Gerar Preferência de pagamento Pix (server-side)
- [ ] QR Code real gerado pela API do MP
- [ ] Webhook `/api/webhooks/mercadopago` com validação HMAC-SHA256
- [ ] Substituir simulação pelo fluxo real
- [ ] Integração com MP Bricks para cartão de crédito
- [ ] Chaves de idempotência para evitar cobrança dupla

### Fase 5 — E-mails (Resend)
- [ ] Obter API key do [Resend](https://resend.com)
- [ ] Template de confirmação de agendamento
- [ ] Template de lembrete (24h antes)
- [ ] Envio automático após pagamento confirmado

### Fase 6 — Painel Admin
- [ ] Dashboard `/admin` com resumo do dia
- [ ] Calendário de agendamentos (visão dia/semana)
- [ ] Confirmar / cancelar agendamentos
- [ ] Bloquear horários (folgas, feriados)
- [ ] CRUD de serviços e preços
- [ ] Visualizar status de pagamentos

### Fase 7 — Hardening
- [ ] Rate limiting nas APIs (Upstash Redis)
- [ ] Configurar Upstash em [upstash.com](https://upstash.com)
- [ ] Headers de segurança (CSP, HSTS) no `next.config.ts`
- [ ] Política de privacidade (LGPD)
- [ ] Endpoint de exclusão de dados do cliente

### Fase 8 — Deploy
- [ ] Criar conta na [Vercel](https://vercel.com)
- [ ] Conectar repositório
- [ ] Configurar todas as variáveis de ambiente na Vercel
- [ ] Domínio personalizado
- [ ] Testar pagamento em ambiente de produção (sandbox MP)
- [ ] Ativar modo produção do Mercado Pago

---

## 🔑 Credenciais ainda necessárias

| Serviço | Onde obter | Para que serve |
|---------|-----------|----------------|
| Mercado Pago Access Token | [mercadopago.com.br](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/credentials) | Processar pagamentos Pix e cartão |
| Supabase Service Role Key | Project Settings → API | Operações admin no banco |
| Resend API Key | [resend.com](https://resend.com) | E-mails de confirmação |
| Upstash Redis | [upstash.com](https://upstash.com) | Rate limiting nas APIs |

---

## 📋 Informações para atualizar no código

- [ ] **Endereço real** da barbearia em `src/components/landing/Location.tsx`
- [ ] **Número de WhatsApp real** em `.env` → `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [ ] **Nome do barbeiro real** no seed SQL
- [ ] **Foto do barbeiro** (upload no Supabase Storage)
- [ ] **Domínio real** em `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL`
