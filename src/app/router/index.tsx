// ─────────────────────────────────────────────────────────
// ROUTER: Application routes
// All 35 routes mapped to full analytics feature modules
// ─────────────────────────────────────────────────────────

import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout'
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><DashboardPage /></AppLayout>,
  },
  {
    path: '/dashboard',
    element: <AppLayout><DashboardPage /></AppLayout>,
  },
  // ── Market ────────────────────────────────────────────
  {
    path: '/market',
    element: <AppLayout><MarketOverviewPage /></AppLayout>,
  },
  {
    path: '/market/explorer',
    element: <AppLayout><MarketExplorerPage /></AppLayout>,
  },
  {
    path: '/market/share',
    element: <AppLayout><MarketSharePage /></AppLayout>,
  },
  {
    path: '/market/trends',
    element: <AppLayout><MarketTrendsPage /></AppLayout>,
  },
  // ── Prescriptions ─────────────────────────────────────
  {
    path: '/prescriptions',
    element: <AppLayout><PrescriptionAnalyticsPage /></AppLayout>,
  },
  {
    path: '/prescriptions/disease',
    element: <AppLayout><DiseaseIntelligencePage /></AppLayout>,
  },
  {
    path: '/prescriptions/co-prescription',
    element: <AppLayout><CoPrescriptionPage /></AppLayout>,
  },
  // ── Doctors ───────────────────────────────────────────
  {
    path: '/doctors',
    element: <AppLayout><DoctorIntelligencePage /></AppLayout>,
  },
  {
    path: '/doctors/:doctorId',
    element: <AppLayout><DoctorDetailPage /></AppLayout>,
  },
  // ── Products ──────────────────────────────────────────
  {
    path: '/products',
    element: <Navigate to="/products/brands" replace />,
  },
  {
    path: '/products/brands',
    element: <AppLayout><BrandIntelligencePage /></AppLayout>,
  },
  {
    path: '/products/molecules',
    element: <AppLayout><MoleculeIntelligencePage /></AppLayout>,
  },
  {
    path: '/products/lifecycle',
    element: <AppLayout><ProductLifecyclePage /></AppLayout>,
  },
  // ── Territories ───────────────────────────────────────
  {
    path: '/territories',
    element: <AppLayout><TerritoriesPage /></AppLayout>,
  },
  {
    path: '/territories/:territoryId',
    element: <AppLayout><TerritoryDetailPage /></AppLayout>,
  },
  {
    path: '/territories/white-space',
    element: <AppLayout><WhiteSpacePage /></AppLayout>,
  },
  // ── Competition ───────────────────────────────────────
  {
    path: '/competition',
    element: <AppLayout><CompetitionPage /></AppLayout>,
  },
  {
    path: '/competition/share',
    element: <AppLayout><CompetitionSharePage /></AppLayout>,
  },
  {
    path: '/competition/switching',
    element: <AppLayout><BrandSwitchingPage /></AppLayout>,
  },
  // ── Demand ────────────────────────────────────────────
  {
    path: '/demand',
    element: <AppLayout><DemandAnalyticsPage /></AppLayout>,
  },
  {
    path: '/demand/seasonality',
    element: <AppLayout><SeasonalityPage /></AppLayout>,
  },
  {
    path: '/demand/availability',
    element: <AppLayout><AvailabilityPage /></AppLayout>,
  },
  // ── Forecast ──────────────────────────────────────────
  {
    path: '/forecast',
    element: <Navigate to="/forecast/demand" replace />,
  },
  {
    path: '/forecast/demand',
    element: <AppLayout><DemandForecastPage /></AppLayout>,
  },
  {
    path: '/forecast/products',
    element: <AppLayout><ProductForecastPage /></AppLayout>,
  },
  {
    path: '/forecast/territories',
    element: <AppLayout><TerritoryForecastPage /></AppLayout>,
  },
  // ── Scenarios ─────────────────────────────────────────
  {
    path: '/scenarios',
    element: <AppLayout><ScenarioSimulatorPage /></AppLayout>,
  },
  // ── Intelligence ──────────────────────────────────────
  {
    path: '/insights',
    element: <AppLayout><InsightsFeedPage /></AppLayout>,
  },
  {
    path: '/insights/anomalies',
    element: <AppLayout><AnomaliesPage /></AppLayout>,
  },
  {
    path: '/insights/alerts',
    element: <AppLayout><AlertsPage /></AppLayout>,
  },
  // ── Opportunities ─────────────────────────────────────
  {
    path: '/opportunities',
    element: <AppLayout><OpportunitiesPage /></AppLayout>,
  },
  // ── AI ────────────────────────────────────────────────
  {
    path: '/ai',
    element: <AppLayout><AiCopilotPage /></AppLayout>,
  },
  // ── Tools ─────────────────────────────────────────────
  {
    path: '/analytics-studio',
    element: <AppLayout><AnalyticsStudioPage /></AppLayout>,
  },
  {
    path: '/reports',
    element: <AppLayout><ReportsPage /></AppLayout>,
  },
  // ── 404 ───────────────────────────────────────────────
  {
    path: '*',
    element: <AppLayout><NotFoundPage /></AppLayout>,
  },
])
