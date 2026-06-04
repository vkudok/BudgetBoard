export type SidebarLink = {
  label: string
  to: string
  icon: string
}

export const sidebarLinks: SidebarLink[] = [
  {
    label: 'Dashboard',
    to: '/',
    icon: 'i-lucide-layout-dashboard'
  },
  {
    label: 'Transactions',
    to: '/transactions',
    icon: 'i-lucide-receipt-text'
  },
  {
    label: 'Categories',
    to: '/categories',
    icon: 'i-lucide-tags'
  },
  {
    label: 'Analytics',
    to: '/analytics',
    icon: 'i-lucide-chart-column'
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: 'i-lucide-settings'
  }
]
