import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAccount } from 'wagmi'
import Landing from './pages/Landing'

const Feed = lazy(() => import('./pages/Feed'))
const Vault = lazy(() => import('./pages/Vault'))
const Profile = lazy(() => import('./pages/Profile'))
const Layout = lazy(() => import('./components/Layout'))

function RouteLoader() {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center">
      <p className="font-mono text-sm text-text-secondary">Loading…</p>
    </div>
  )
}

export default function App() {
  const { isConnected } = useAccount()

  if (!isConnected) return <Landing />

  return (
    <Suspense fallback={<RouteLoader />}>
      <Layout>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Suspense>
  )
}
