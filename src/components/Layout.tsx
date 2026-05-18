import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
