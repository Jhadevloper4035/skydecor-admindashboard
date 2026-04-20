export const MENU_ITEMS = [
  // ── General ────────────────────────────────────────────────────────────────
  {
    key: 'general',
    label: 'General',
    isTitle: true,
  },
  {
    key: 'dashboards',
    icon: 'iconamoon:home-duotone',
    label: 'Dashboards',
    children: [
      {
        key: 'dashboard-analytics',
        label: 'Analytics',
        url: '/dashboard/analytics',
        parentKey: 'dashboards',
      }
    ],
  },


    {
    key: 'showroom-leads-section',
    label: 'Leads',
    isTitle: true,
    roles: ['admin', 'superadmin', 'event'],
  },



  {
    key: 'showroom-leads',
    icon: 'iconamoon:comment-dots-duotone',
    label: 'Showroom Leads',
    url: '/showroom-leads',
    roles: ['admin', 'superadmin', 'event'],
  },

  // ── Leads ──────────────────────────────────────────────────────────────────
  {
    key: 'leads',
    icon: 'iconamoon:comment-dots-duotone',
    label: 'Leads',
    roles: ['admin', 'superadmin', 'event'],
    children: [
      {
        key: 'event-lead-1',
        label: 'Matecia 2025',
        url: '/pages/event-leads/MATECIA 2025',
        parentKey: 'leads',
      },
      {
        key: 'event-lead-2',
        label: 'Foaid 2025 Delhi',
        url: '/pages/event-leads/FOAID 2025 Delhi',
        parentKey: 'leads',
      },
      {
        key: 'event-lead-3',
        label: 'Legacy 3.0 Meerut',
        url: '/pages/event-leads/Legacy 3.0 Meerut',
        parentKey: 'leads',
      },
      {
        key: 'event-lead-4',
        label: 'Foaid Mumbai Exhibition',
        url: '/pages/event-leads/FOAID MUMBAI exhibition',
        parentKey: 'leads',
      },
      {
        key: 'event-lead-6',
        label: 'Indiawood Exhibition',
        url: '/pages/event-leads/indiawood-exhibition',
        parentKey: 'leads',
      },
      {
        key: 'event-lead-7',
        label: 'Idac Mumbai 2026',
        url: '/pages/event-leads/idac-mumbai-2026',
        parentKey: 'leads',
      },
    ],
  },

  // ── Website Apps ──────────────────────────────────────────────────────────
  {
    key: 'website-apps',
    label: 'Website Apps',
    isTitle: true,
  },
  {
    key: 'website-leads',
    icon: 'iconamoon:email-thin',
    label: 'Website Leads',
    url: '/pages/website-leads',
  },
  {
    key: 'product-enquiries',
    icon: 'iconamoon:shopping-bag-duotone',
    label: 'Product Enquiries',
    url: '/pages/product-enquiries',
  },
  {
    key: 'job-applications',
    icon: 'iconamoon:profile-circle-duotone',
    label: 'Job Applications',
    url: '/pages/job-applications',
  },
  {
    key: 'qr-codes',
    icon: 'iconamoon:comment-dots-duotone',
    label: 'Qr Codes',
    url: '/pages/qr-codes',
  },

  // ── Website Utilities ─────────────────────────────────────────────────────
  {
    key: 'website-utilities',
    label: 'Website Utilities',
    isTitle: true,
  },
  {
    key: 'products',
    icon: 'iconamoon:shopping-bag-duotone',
    label: 'Products',
    children: [
      {
        key: 'products-list',
        label: 'All Products',
        url: '/ecommerce/inventory',
        parentKey: 'products',
      },
      {
        key: 'products-create',
        label: 'Create Product',
        url: '/ecommerce/products/create',
        parentKey: 'products',
      },
    ],
  },
  {
    key: 'blogs',
    icon: 'iconamoon:edit-duotone',
    label: 'Blogs',
    children: [
      {
        key: 'blogs-list',
        label: 'All Blogs',
        url: '/blogs',
        parentKey: 'blogs',
      },
      {
        key: 'blogs-create',
        label: 'Create Blog',
        url: '/blogs/create',
        parentKey: 'blogs',
      },
    ],
  },
  {
    key: 'events',
    icon: 'iconamoon:store-thin',
    label: 'Events',
    children: [
      {
        key: 'events-list',
        label: 'All Events',
        url: '/events',
        parentKey: 'events',
      },
      {
        key: 'events-create',
        label: 'Create Event',
        url: '/events/create',
        parentKey: 'events',
      },
    ],
  },
  {
    key: 'showrooms',
    icon: 'iconamoon:store-thin',
    label: 'Showrooms',
    children: [
      {
        key: 'showrooms-list',
        label: 'All Showrooms',
        url: '/showrooms',
        parentKey: 'showrooms',
      },
      {
        key: 'showrooms-create',
        label: 'Create Showroom',
        url: '/showrooms/create',
        parentKey: 'showrooms',
      },
    ],
  },
  {
    key: 'seo-meta',
    icon: 'iconamoon:trend-up-duotone',
    label: 'SEO Meta',
    children: [
      {
        key: 'seo-meta-list',
        label: 'All Pages',
        url: '/seo-meta',
        parentKey: 'seo-meta',
      },
      {
        key: 'seo-meta-create',
        label: 'Create SEO Meta',
        url: '/seo-meta/create',
        parentKey: 'seo-meta',
      },
    ],
  },

  // ── Administration (admin + superadmin) ──────────────────────────────────
  {
    key: 'admin-section',
    label: 'Administration',
    isTitle: true,
    roles: ['admin', 'superadmin'],
  },
  {
    key: 'user-management',
    icon: 'iconamoon:profile-circle-duotone',
    label: 'User Management',
    roles: ['admin', 'superadmin'],
    children: [
      {
        key: 'users-list',
        label: 'All Users',
        url: '/users',
        parentKey: 'user-management',
      },
      {
        key: 'users-create',
        label: 'Create User',
        url: '/auth/sign-up',
        parentKey: 'user-management',
      },
    ],
  },

  // ── Authentication ────────────────────────────────────────────────────────
  {
    key: 'auth-section',
    label: 'Authentication',
    isTitle: true,
  },
  {
    key: 'auth',
    icon: 'iconamoon:lock-off-light',
    label: 'Authentication',
    children: [
      {
        key: 'auth-logout',
        label: 'Logout',
        url: '/auth/sign-in',
        parentKey: 'auth',
      },
    ],
  },
]
