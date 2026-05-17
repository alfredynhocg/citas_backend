import type { MenuItemType } from '@/types/layout'

export const menuItems: MenuItemType[] = [
  {
    key: 'main-title',
    label: 'Principal',
    isTitle: true,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'lucide:layout-dashboard',
    url: '/dashboard/citas',
  },

  {
    key: 'app-title',
    label: 'Aplicación',
    isTitle: true,
  },
  {
    key: 'citas',
    label: 'Citas',
    icon: 'lucide:heart',
    url: '/citas',
  },
  {
    key: 'parejas',
    label: 'Parejas',
    icon: 'lucide:users-round',
    url: '/parejas',
  },
  {
    key: 'recuerdos',
    label: 'Recuerdos',
    icon: 'lucide:camera',
    url: '/recuerdos',
  },

  {
    key: 'admin-title',
    label: 'Administración',
    isTitle: true,
  },
  {
    key: 'usuarios',
    label: 'Usuarios',
    icon: 'lucide:shield-user',
    url: '/users/list',
  },
  {
    key: 'categorias',
    label: 'Categorías',
    icon: 'lucide:tag',
    url: '/admin/categorias',
  },
  {
    key: 'negocios',
    label: 'Negocios',
    icon: 'lucide:store',
    url: '/admin/negocios',
  },
  {
    key: 'perfil',
    label: 'Mi Perfil',
    icon: 'lucide:circle-user',
    url: '/perfil',
  },
]
