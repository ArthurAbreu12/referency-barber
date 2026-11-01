import { supabase } from '@/lib/supabase-server'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Services from '@/components/landing/Services'
import Barbers from '@/components/landing/Barbers'
import Location from '@/components/landing/Location'
import Footer from '@/components/landing/Footer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const { data: rawBarbers, error } = await supabase
    .from('Barber')
    .select('*')
    .eq('isActive', true)

  if (error) {
    console.error('ERRO AO BUSCAR BARBEIROS:', error.message)
  }

  // Normaliza o campo 'id' de número (int8) para string para garantir compatibilidade com o componente Barbers
  const barbers = (rawBarbers ?? []).map(barber => ({
    ...barber,
    id: String(barber.id)
  }))

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Barbers barbers={barbers} />
        <Location />
      </main>
      <Footer />
    </>
  )
}