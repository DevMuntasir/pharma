// ─────────────────────────────────────────────────────────
// NAVIGATION: Sidebar config
// All nav groups and items
// ─────────────────────────────────────────────────────────

import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Stethoscope,
  Brain,
  Pill,
  FlaskConical,
  Activity,
  Map,
  MapPin,
  Target,
  Swords,
  ArrowLeftRight,
  Shuffle,
  Warehouse,
  Cloud,
  Package,
  Telescope,
  BarChart2,
  TriangleAlert,
  BellRing,
  Gem,
  Bot,
  TestTube2,
  FileBarChart,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Command Center',
    items: [
      { label: 'Executive Overview', path: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Market Overview', path: '/market', icon: TrendingUp },
      { label: 'Market Explorer', path: '/market/explorer', icon: BarChart3 },
      { label: 'Market Share', path: '/market/share', icon: PieChart },
      { label: 'Market Trends', path: '/market/trends', icon: LineChart },
      { label: 'Prescription Analytics', path: '/prescriptions', icon: Stethoscope },
      { label: 'Disease Intelligence', path: '/prescriptions/disease', icon: Brain },
      { label: 'Doctor Intelligence', path: '/doctors', icon: Activity },
      { label: 'Co-Prescription', path: '/prescriptions/co-prescription', icon: FlaskConical },
      { label: 'Brand Intelligence', path: '/products/brands', icon: Pill },
      { label: 'Molecule Intelligence', path: '/products/molecules', icon: TestTube2 },
      { label: 'Product Lifecycle', path: '/products/lifecycle', icon: Activity },
    ],
  },
  {
    label: 'Geography',
    items: [
      { label: 'Bangladesh Market', path: '/territories', icon: Map },
      { label: 'Territory Analytics', path: '/territories', icon: MapPin },
      { label: 'White Space', path: '/territories/white-space', icon: Target },
    ],
  },
  {
    label: 'Competition',
    items: [
      { label: 'Competitor Intelligence', path: '/competition', icon: Swords },
      { label: 'Share Movement', path: '/competition/share', icon: ArrowLeftRight },
      { label: 'Brand Switching', path: '/competition/switching', icon: Shuffle },
    ],
  },
  {
    label: 'Demand',
    items: [
      { label: 'Demand Analytics', path: '/demand', icon: BarChart2 },
      { label: 'Seasonality', path: '/demand/seasonality', icon: Cloud },
      { label: 'Availability', path: '/demand/availability', icon: Warehouse },
    ],
  },
  {
    label: 'Predictive',
    items: [
      { label: 'Demand Forecast', path: '/forecast/demand', icon: Telescope },
      { label: 'Product Forecast', path: '/forecast/products', icon: Package },
      { label: 'Territory Forecast', path: '/forecast/territories', icon: Map },
      { label: 'Scenario Simulator', path: '/scenarios', icon: TestTube2 },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Intelligence Feed', path: '/insights', icon: Gem },
      { label: 'Anomalies', path: '/insights/anomalies', icon: TriangleAlert },
      { label: 'Early Warnings', path: '/insights/alerts', icon: BellRing },
      { label: 'Growth Opportunities', path: '/opportunities', icon: Target },
    ],
  },
  {
    label: 'AI',
    items: [
      { label: 'Pharma Copilot', path: '/ai', icon: Bot },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Analytics Studio', path: '/analytics-studio', icon: BarChart3 },
      { label: 'Reports', path: '/reports', icon: FileBarChart },
    ],
  },
]
