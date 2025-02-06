import { 
    Home, Package, Users, ShoppingCart, 
    CreditCard, BarChart2, Plus, Edit, 
    Trash2, Box, Tag, Clock 
  } from 'lucide-react';
  
  export const navigationConfig = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: Home
    },
    {
      title: 'Orders',
      path: '/admin/orders',
      icon: ShoppingCart,
      submenu: [
        { title: 'All Orders', path: '/admin/orders/all' },
        { title: 'Pending Orders', path: '/admin/orders/pending' },
        { title: 'Completed Orders', path: '/admin/orders/completed' },
        { title: 'Canceled Orders', path: '/admin/orders/canceled' }
      ]
    },
    {
      title: 'Products',
      path: '/admin/products',
      icon: Package,
      submenu: [
        { title: 'View Products', path: '/admin/products/view' },
        { title: 'Add Product', path: '/admin/products/add', icon: Plus },
        { title: 'Categories', path: '/admin/products/categories', icon: Tag },
        { title: 'Inventory', path: '/admin/products/inventory', icon: Box }
      ]
    },
    {
      title: 'Customers',
      path: '/admin/customers',
      icon: Users,
      submenu: [
        { title: 'All Customers', path: '/admin/customers/all' },
        { title: 'Customer Groups', path: '/admin/customers/groups' }
      ]
    },
    {
      title: 'Sales',
      path: '/admin/sales',
      icon: BarChart2,
      submenu: [
        { title: 'Sales Overview', path: '/admin/sales/overview' },
        { title: 'Reports', path: '/admin/sales/reports' },
        { title: 'Analytics', path: '/admin/sales/analytics' }
      ]
    },
    {
      title: 'Payments',
      path: '/admin/payments',
      icon: CreditCard,
      submenu: [
        { title: 'Transaction History', path: '/admin/payments/history' },
        { title: 'Payment Methods', path: '/admin/payments/methods' },
        { title: 'Refunds', path: '/admin/payments/refunds' }
      ]
    }
  ];