import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Box,
  Settings,
  Activity,
  Image as ImageIcon,
  CreditCard,
  FileText,
  BookOpen
} from 'lucide-react';

export const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Tests', href: '/admin/products', icon: FileText },
  { label: 'Materials', href: '/admin/categories', icon: BookOpen },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
];

export const adminNavBottom = [
  { label: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];
