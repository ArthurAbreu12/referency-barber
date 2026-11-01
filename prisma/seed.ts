import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ─────────────────────────────────────────────────────────────
  // 1. Clean up (optional - remove if you want to keep data)
  // ─────────────────────────────────────────────────────────────
  // await prisma.booking.deleteMany({})
  // await prisma.payment.deleteMany({})
  // await prisma.blockedSlot.deleteMany({})
  // await prisma.schedule.deleteMany({})
  // await prisma.barber.deleteMany({})
  // await prisma.service.deleteMany({})
  // await prisma.user.deleteMany({})

  // ─────────────────────────────────────────────────────────────
  // 2. Create Services (4 fixed services as per CLAUDE.md)
  // ─────────────────────────────────────────────────────────────
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-corte' },
      update: {},
      create: {
        id: 'service-corte',
        name: 'Corte de Cabelo',
        description: 'Corte profissional com acabamento premium',
        priceInCents: 3000, // R$ 30.00
        durationMins: 30,
        isActive: true,
        displayOrder: 1,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-cabelo-sobrancelha' },
      update: {},
      create: {
        id: 'service-cabelo-sobrancelha',
        name: 'Cabelo + Sobrancelha',
        description: 'Corte de cabelo e design de sobrancelha',
        priceInCents: 3500, // R$ 35.00
        durationMins: 45,
        isActive: true,
        displayOrder: 2,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-barba-cabelo' },
      update: {},
      create: {
        id: 'service-barba-cabelo',
        name: 'Barba + Cabelo',
        description: 'Corte de barba completo + corte de cabelo',
        priceInCents: 3500, // R$ 35.00
        durationMins: 45,
        isActive: true,
        displayOrder: 3,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-combo-completo' },
      update: {},
      create: {
        id: 'service-combo-completo',
        name: 'Combo Completo',
        description: 'Cabelo + Sobrancelha + Barba - pacote completo',
        priceInCents: 4000, // R$ 40.00
        durationMins: 60,
        isActive: true,
        displayOrder: 4,
      },
    }),
  ])

  console.log(`✅ Created ${services.length} services`)

  // ─────────────────────────────────────────────────────────────
  // 3. Create Barber (1 barber for now)
  // ─────────────────────────────────────────────────────────────
  const barber = await prisma.barber.upsert({
    where: { id: 'barber-joao' },
    update: {},
    create: {
      id: 'barber-joao',
      name: 'João Silva',
      bio: 'Barbeiro profissional com 10 anos de experiência',
      photoUrl: null, // Will be added later via Supabase Storage
      isActive: true,
    },
  })

  console.log(`✅ Created barber: ${barber.name}`)

  // ─────────────────────────────────────────────────────────────
  // 4. Create Schedule (recurring hours for the barber)
  // Mon-Sat 9am-6pm with 12-1pm lunch break
  // ─────────────────────────────────────────────────────────────
  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  const schedules = await Promise.all(
    daysOfWeek.map((day) =>
      prisma.schedule.upsert({
        where: {
          barberId_dayOfWeek: {
            barberId: barber.id,
            dayOfWeek: day as any,
          },
        },
        update: {},
        create: {
          barberId: barber.id,
          dayOfWeek: day as any,
          startTime: '06:00',
          endTime: '21:00',
          breakStart: null,
          breakEnd: null,
          isActive: true,
        },
      })
    )
  )

  console.log(`✅ Created ${schedules.length} schedules (every day, 6am-9pm)`)

  // ─────────────────────────────────────────────────────────────
  // 5. Create Admin User
  // ─────────────────────────────────────────────────────────────
  const hashedPassword = await bcryptjs.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@referencybarber.com.br' },
    update: {},
    create: {
      name: 'Admin Referency',
      email: 'admin@referencybarber.com.br',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log(`✅ Created admin user: ${adminUser.email}`)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
