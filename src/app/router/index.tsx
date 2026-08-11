// ─────────────────────────────────────────────────────────
// ROUTER: Application routes
// All 35 routes mapped to full analytics feature modules.
// Protected by authentication + role-based access.
// ─────────────────────────────────────────────────────────

import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginPage } from '@/features/auth/LoginPage'
import { DashboardPage } from '@/features/command-center/DashboardPage'
import {
  MarketOverviewPage,
  MarketExplorerPage,
  MarketSharePage,
  MarketTrendsPage,
} from '@/features/market/MarketOverviewPage'
import {
  PrescriptionAnalyticsPage,
  DiseaseIntelligencePage,
  CoPrescriptionPage,
} from '@/features/prescriptions/PrescriptionAnalyticsPage'
import {
  DoctorIntelligencePage,
  DoctorDetailPage,
} from '@/features/doctors/DoctorIntelligencePage'
import {
  BrandIntelligencePage,
  MoleculeIntelligencePage,
  ProductLifecyclePage,
} from '@/features/products/ProductIntelligencePage'
import {
  TerritoriesPage,
  TerritoryDetailPage,
  WhiteSpacePage,
} from '@/features/geography/GeographyAnalyticsPage'
import {
  CompetitionPage,
  CompetitionSharePage,
  BrandSwitchingPage,
} from '@/features/competition/CompetitionAnalyticsPage'
import {
  DemandAnalyticsPage,
  SeasonalityPage,
  AvailabilityPage,
} from '@/features/demand/DemandAnalyticsPage'
import {
  DemandForecastPage,
  ProductForecastPage,
  TerritoryForecastPage,
} from '@/features/forecasting/ForecastingPage'
import { ScenarioSimulatorPage } from '@/features/scenarios/ScenarioSimulatorPage'
import {
  InsightsFeedPage,
  AnomaliesPage,
  AlertsPage,
  OpportunitiesPage,
} from '@/features/insights/IntelligenceFeedPage'
import { AiCopilotPage } from '@/features/ai/AiCopilotPage'
import {
  AnalyticsStudioPage,
  ReportsPage,
} from '@/features/analytics-studio/AnalyticsStudioPage'
import { NotFoundPage } from '@/features/placeholder/ComingSoonPage'

// ── Helper: wrap a page in AppLayout + ProtectedRoute ────

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export const router = createBrowserRouter([
  // ── Public ─────────────────────────────────────────────
  {
    path: '/login',
    element: <LoginPage />,
  },

  // ── Root redirect ──────────────────────────────────────
  {
    path: '/',
    element: <Protected><DashboardPage /></Protected>,
  },
  {
    path: '/dashboard',
    element: <Protected><DashboardPage /></Protected>,
  },

  // ── Market ────────────────────────────────────────────
  {
    path: '/market',
    element: <Protected><MarketOverviewPage /></Protected>,
  },
  {
    path: '/market/explorer',
    element: <Protected><MarketExplorerPage /></Protected>,
  },
  {
    path: '/market/share',
    element: <Protected><MarketSharePage /></Protected>,
  },
  {
    path: '/market/trends',
    element: <Protected><MarketTrendsPage /></Protected>,
  },

  // ── Prescriptions ─────────────────────────────────────
  {
    path: '/prescriptions',
    element: <Protected><PrescriptionAnalyticsPage /></Protected>,
  },
  {
    path: '/prescriptions/disease',
    element: <Protected><DiseaseIntelligencePage /></Protected>,
  },
  {
    path: '/prescriptions/co-prescription',
    element: <Protected><CoPrescriptionPage /></Protected>,
  },

  // ── Doctors ───────────────────────────────────────────
  {
    path: '/doctors',
    element: <Protected><DoctorIntelligencePage /></Protected>,
  },
  {
    path: '/doctors/:doctorId',
    element: <Protected><DoctorDetailPage /></Protected>,
  },

  // ── Products ──────────────────────────────────────────
  {
    path: '/products',
    element: <Navigate to="/products/brands" replace />,
  },
  {
    path: '/products/brands',
    element: <Protected><BrandIntelligencePage /></Protected>,
  },
  {
    path: '/products/molecules',
    element: <Protected><MoleculeIntelligencePage /></Protected>,
  },
  {
    path: '/products/lifecycle',
    element: <Protected><ProductLifecyclePage /></Protected>,
  },

  // ── Territories ───────────────────────────────────────
  {
    path: '/territories',
    element: <Protected><TerritoriesPage /></Protected>,
  },
  {
    path: '/territories/:territoryId',
    element: <Protected><TerritoryDetailPage /></Protected>,
  },
  {
    path: '/territories/white-space',
    element: <Protected><WhiteSpacePage /></Protected>,
  },

  // ── Competition ───────────────────────────────────────
  {
    path: '/competition',
    element: <Protected><CompetitionPage /></Protected>,
  },
  {
    path: '/competition/share',
    element: <Protected><CompetitionSharePage /></Protected>,
  },
  {
    path: '/competition/switching',
    element: <Protected><BrandSwitchingPage /></Protected>,
  },

  // ── Demand ────────────────────────────────────────────
  {
    path: '/demand',
    element: <Protected><DemandAnalyticsPage /></Protected>,
  },
  {
    path: '/demand/seasonality',
    element: <Protected><SeasonalityPage /></Protected>,
  },
  {
    path: '/demand/availability',
    element: <Protected><AvailabilityPage /></Protected>,
  },

  // ── Forecast ──────────────────────────────────────────
  {
    path: '/forecast',
    element: <Navigate to="/forecast/demand" replace />,
  },
  {
    path: '/forecast/demand',
    element: <Protected><DemandForecastPage /></Protected>,
  },
  {
    path: '/forecast/products',
    element: <Protected><ProductForecastPage /></Protected>,
  },
  {
    path: '/forecast/territories',
    element: <Protected><TerritoryForecastPage /></Protected>,
  },

  // ── Scenarios ─────────────────────────────────────────
  {
    path: '/scenarios',
    element: <Protected><ScenarioSimulatorPage /></Protected>,
  },

  // ── Intelligence ──────────────────────────────────────
  {
    path: '/insights',
    element: <Protected><InsightsFeedPage /></Protected>,
  },
  {
    path: '/insights/anomalies',
    element: <Protected><AnomaliesPage /></Protected>,
  },
  {
    path: '/insights/alerts',
    element: <Protected><AlertsPage /></Protected>,
  },

  // ── Opportunities ─────────────────────────────────────
  {
    path: '/opportunities',
    element: <Protected><OpportunitiesPage /></Protected>,
  },

  // ── AI ────────────────────────────────────────────────
  {
    path: '/ai',
    element: <Protected><AiCopilotPage /></Protected>,
  },

  // ── Tools ─────────────────────────────────────────────
  {
    path: '/analytics-studio',
    element: <Protected><AnalyticsStudioPage /></Protected>,
  },
  {
    path: '/reports',
    element: <Protected><ReportsPage /></Protected>,
  },

  // ── 404 ───────────────────────────────────────────────
  {
    path: '*',
    element: <Protected><NotFoundPage /></Protected>,
  },
])
