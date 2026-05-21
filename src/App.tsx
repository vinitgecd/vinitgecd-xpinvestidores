/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Login from './pages/Login'
import EsqueceuSenha from './pages/EsqueceuSenha'
import AlterarSenha from './pages/AlterarSenha'
import AdminDashboard from './pages/admin/Dashboard'
import AssessorProfile from './pages/assessor/Profile'
import MeusClientes from './pages/assessor/MeusClientes'
import NovoCliente from './pages/clientes/NovoCliente'
import ClientesList from './pages/clientes/ClientesList'
import ContatosList from './pages/admin/ContatosList'
import NovoContato from './pages/admin/NovoContato'
import AssessoresList from './pages/admin/AssessoresList'
import { AuthProvider, useAuth } from './hooks/use-auth'
import React, { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const ConfiguracoesPage = React.lazy(() => import('./pages/admin/Configuracoes'))

const DashboardRouter = () => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/admin/painel-de-controle" replace />
  return <Navigate to="/meus-clientes" replace />
}

// ONLY IMPORT AND RENDER WORKING PAGES, NEVER ADD PLACEHOLDER COMPONENTS OR PAGES IN THIS FILE
// AVOID REMOVING ANY CONTEXT PROVIDERS FROM THIS FILE (e.g. TooltipProvider, Toaster, Sonner)

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
            <Route path="/alterar-senha" element={<AlterarSenha />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/admin/painel-de-controle" element={<AdminDashboard />} />
            <Route path="/perfil-do-avaliador" element={<AssessorProfile />} />
            <Route path="/perfil-do-avaliador/:id" element={<AssessorProfile />} />
            <Route path="/meus-clientes" element={<MeusClientes />} />
            <Route path="/novo-cliente" element={<NovoCliente />} />
            <Route path="/clientes" element={<ClientesList />} />
            <Route
              path="/configuracoes"
              element={
                <Suspense
                  fallback={
                    <div className="container mx-auto p-6 max-w-4xl space-y-6">
                      <Skeleton className="h-10 w-48" />
                      <Skeleton className="h-[400px] w-full" />
                    </div>
                  }
                >
                  <ConfiguracoesPage />
                </Suspense>
              }
            />
            <Route path="/contatos" element={<ContatosList />} />
            <Route path="/contatos/novo" element={<NovoContato />} />
            <Route path="/admin/assessores" element={<AssessoresList />} />
            {/* ADD ALL CUSTOM ROUTES MUST BE ADDED HERE */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
