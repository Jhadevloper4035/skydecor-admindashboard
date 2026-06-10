export const MENU_ITEMS = [
  // ── General ────────────────────────────────────────────────────────────────
  {
    key: 'general',
    label: 'General',
    isTitle: true,
    roles: ['admin', 'superadmin', 'event', 'showroom', 'website', 'sales'],
    permissions: ['dashboard.view'],
  },
  {
    key: 'dashboard',
    icon: 'iconamoon:home-duotone',
    label: 'Dashboard',
    url: '/dashboard',
    roles: ['admin', 'superadmin', 'event', 'showroom', 'website', 'sales'],
    permissions: ['dashboard.view'],
  },


  {
    key: 'showroom-leads-section',
    label: 'Showroom Enquiry',
    isTitle: true,
    roles: ['admin', 'superadmin', 'event'],
    permissions: ['showroomLeads.manage'],
  },



  {
    key: 'showroom-leads',
    icon: 'iconamoon:comment-dots-duotone',
    label: 'Showroom Enquiry',
    roles: ['admin', 'superadmin', 'event'],
    permissions: ['showroomLeads.manage'],
    children: [
      {
        key: 'showroom-leads-list',
        label: 'All Enquiries',
        url: '/showroom-leads',
        parentKey: 'showroom-leads',
      },
      {
        key: 'showroom-leads-add',
        label: 'Add New Enquiry',
        url: '/showroom-lead',
        parentKey: 'showroom-leads',
      },
    ],
  },

  // ── Event Enquiries ────────────────────────────────────────────────────────
  {
    key: 'leads',
    icon: 'iconamoon:comment-dots-duotone',
    label: 'Events Enquiry',
    roles: ['admin', 'superadmin', 'event'],
    permissions: ['eventLeads.view'],
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
        {
        key: 'event-lead-8',
        label: 'DubaiWoodShow',
        url: '/pages/event-leads/dubaiwoodshow',
        parentKey: 'leads',
      },
    ],
  },

  // ── Website Apps ──────────────────────────────────────────────────────────
  {
    key: 'website-apps',
    label: 'Website Apps',
    isTitle: true,
    roles: ['admin', 'superadmin', 'website', 'sales', 'jobs'],
    permissions: ['websiteLeads.manage', 'productEnquiries.view', 'jobApplications.view', 'qrCodes.manage'],
  },
  {
    key: 'website-leads',
    icon: 'iconamoon:email-thin',
    label: 'Website Leads',
    url: '/pages/website-leads',
    roles: ['admin', 'superadmin', 'website', 'sales'],
    permissions: ['websiteLeads.manage'],
  },
  {
    key: 'product-enquiries',
    icon: 'iconamoon:shopping-bag-duotone',
    label: 'Product Enquiries',
    url: '/pages/product-enquiries',
    roles: ['admin', 'superadmin', 'website', 'sales'],
    permissions: ['productEnquiries.view'],
  },
  {
    key: 'job-applications',
    icon: 'iconamoon:profile-circle-duotone',
    label: 'Job Enquiry',
    url: '/pages/job-applications',
    roles: ['admin', 'superadmin', 'website', 'sales', 'jobs'],
    permissions: ['jobApplications.view'],
  },
  {
    key: 'qr-codes',
    icon: 'iconamoon:comment-dots-duotone',
    label: 'Qr Codes',
    url: '/pages/qr-codes',
    roles: ['admin', 'superadmin', 'website', 'sales'],
    permissions: ['qrCodes.manage'],
  },

  // ── Website Utilities ─────────────────────────────────────────────────────
  {
    key: 'website-utilities',
    label: 'Website Utilities',
    isTitle: true,
    roles: ['admin', 'superadmin', 'jobs'],
    permissions: ['products.manage', 'blogs.manage', 'jobs.manage', 'events.manage', 'cisrEvents.manage', 'showrooms.manage', 'seoMeta.manage'],
  },
  {
    key: 'products',
    icon: 'iconamoon:shopping-bag-duotone',
    label: 'Products',
    roles: ['admin', 'superadmin'],
    permissions: ['products.manage'],
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
    roles: ['admin', 'superadmin'],
    permissions: ['blogs.manage'],
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
    key: 'jobs',
    icon: 'iconamoon:profile-circle-duotone',
    label: 'Jobs Post',
    roles: ['admin', 'superadmin', 'jobs'],
    permissions: ['jobs.manage'],
    children: [
      {
        key: 'jobs-list',
        label: 'All Jobs',
        url: '/jobs',
        parentKey: 'jobs',
      },
      {
        key: 'jobs-create',
        label: 'Create Job',
        url: '/jobs/create',
        parentKey: 'jobs',
      },
    ],
  },
  {
    key: 'events',
    icon: 'iconamoon:store-thin',
    label: 'Events',
    roles: ['admin', 'superadmin'],
    permissions: ['events.manage'],
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
    key: 'cisr-events',
    icon: 'iconamoon:calendar-1-duotone',
    label: 'CISR Events',
    roles: ['admin', 'superadmin'],
    permissions: ['cisrEvents.manage'],
    children: [
      {
        key: 'cisr-events-list',
        label: 'All CISR Events',
        url: '/cisr-events',
        parentKey: 'cisr-events',
      },
      {
        key: 'cisr-events-create',
        label: 'Create CISR Event',
        url: '/cisr-events/create',
        parentKey: 'cisr-events',
      },
    ],
  },
  {
    key: 'showrooms',
    icon: 'iconamoon:store-thin',
    label: 'Showrooms',
    roles: ['admin', 'superadmin'],
    permissions: ['showrooms.manage'],
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
    roles: ['admin', 'superadmin'],
    permissions: ['seoMeta.manage'],
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
    permissions: ['users.manage'],
  },
  {
    key: 'user-management',
    icon: 'iconamoon:profile-circle-duotone',
    label: 'User Management',
    roles: ['admin', 'superadmin'],
    permissions: ['users.manage'],
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
        key: 'auth-change-password',
        label: 'Change Password',
        url: '/auth/change-password',
        parentKey: 'auth',
      },
      {
        key: 'auth-logout',
        label: 'Logout',
        url: '/auth/sign-in',
        parentKey: 'auth',
      },
    ],
  },
]
