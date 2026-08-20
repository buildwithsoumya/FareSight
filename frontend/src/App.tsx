import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import LoadingSpinner from './components/common/LoadingSpinner'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Prediction = lazy(() => import('./pages/Prediction'))
const Insights = lazy(() => import('./pages/Insights'))

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading page..." />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
