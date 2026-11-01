# Referency Barber

Site institucional + sistema de agendamento online com pagamento para a barbearia **Referency Barber**.

**Stack**: Next.js 15 · TypeScript · Tailwind CSS v4 · Supabase (PostgreSQL) · NextAuth · Mercado Pago

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### 1. Clonar o repositório
```bash
git clone https://github.com/KelvinBellann/referency-barber.git
cd referency-barber
```

### 2. Instalar dependências
```bash
npm install --force
```

> `--force` necessário por incompatibilidade de peer deps entre Next.js 15 e NextAuth v4.

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz (use `.env.example` como base):

```env
NEXT_PUBLIC_SUPABASE_URL="https://SEU_PROJETO.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."
SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."
NEXTAUTH_SECRET="gere com: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="APP_USR-..."
NEXT_PUBLIC_MP_ENVIRONMENT="sandbox"
RESEND_API_KEY="re_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="5511999999999"
```

### 4. Configurar o banco no Supabase

No **SQL Editor** do Supabase, execute em ordem:

**4.1 — Criar tabelas** (gere o SQL com):
```bash
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script
```

**4.2 — Seed + permissões** (arquivo `prisma/setup.sql` na raiz)

### 5. Rodar
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Servidor de produção |
| `npm run lint` | Lint |

---

## Deploy na Vercel

1. Conecte o repositório no [Vercel](https://vercel.com)
2. Adicione as variáveis de ambiente
3. Deploy automático a cada `git push`
