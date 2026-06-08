import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StoreProvider, useStore } from './store'
import ToastContainer from './components/Toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Streams from './pages/Streams'
import Reports from './pages/Reports'
import Economy from './pages/Economy'
import KYC from './pages/KYC'
import GiftCatalog from './pages/GiftCatalog'
import CoinPackages from './pages/CoinPackages'
import Competitions from './pages/Competitions'
import Prestige from './pages/Prestige'
import FortuneWheel from './pages/FortuneWheel'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import AdminTeam from './pages/AdminTeam'
import FraudDetect from './pages/FraudDetect'
import Login from './pages/Login'
import AcceptInvite from './pages/AcceptInvite'

function AppRoutes() {
  const { isAuthenticated } = useStore()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/accept-invite" element={<AcceptInvite />} />
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="streams" element={<Streams />} />
        <Route path="reports" element={<Reports />} />
        <Route path="economy" element={<Economy />} />
        <Route path="kyc" element={<KYC />} />
        <Route path="fraud-detect" element={<FraudDetect />} />
        <Route path="gift-catalog" element={<GiftCatalog />} />
        <Route path="coin-packages" element={<CoinPackages />} />
        <Route path="competitions" element={<Competitions />} />
        <Route path="prestige" element={<Prestige />} />
        <Route path="fortune-wheel" element={<FortuneWheel />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin-team" element={<AdminTeam />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <ToastContainer />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  )
}
