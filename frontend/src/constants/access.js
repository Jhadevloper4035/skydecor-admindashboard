export const ACCESS_TYPES = ['superadmin', 'admin', 'custom', 'website', 'event', 'showroom', 'sales', 'jobs'];

export const SERVICE_PERMISSIONS = [
  { value: 'dashboard.view', label: 'Dashboard' },
  { value: 'users.manage', label: 'User Management' },
  { value: 'products.manage', label: 'Products' },
  { value: 'blogs.manage', label: 'Blogs' },
  { value: 'events.manage', label: 'Events' },
  { value: 'cisrEvents.manage', label: 'CISR Events' },
  { value: 'showrooms.manage', label: 'Showrooms' },
  { value: 'seoMeta.manage', label: 'SEO Meta' },
  { value: 'qrCodes.manage', label: 'QR Codes' },
  { value: 'websiteLeads.manage', label: 'Website Leads' },
  { value: 'productEnquiries.view', label: 'Product Enquiries' },
  { value: 'jobApplications.view', label: 'Job Applications' },
  { value: 'jobs.manage', label: 'Job Posts' },
  { value: 'eventLeads.view', label: 'Event Leads' },
  { value: 'showroomLeads.manage', label: 'Showroom Leads' },
];

const ROLE_PERMISSIONS = {
  superadmin: ['*'],
  admin: ['*'],
  website: ['dashboard.view', 'websiteLeads.manage', 'productEnquiries.view', 'jobApplications.view', 'qrCodes.manage'],
  sales: ['dashboard.view', 'websiteLeads.manage', 'productEnquiries.view', 'jobApplications.view', 'qrCodes.manage'],
  event: ['dashboard.view', 'eventLeads.view', 'showroomLeads.manage'],
  showroom: ['dashboard.view', 'showroomLeads.manage'],
  jobs: ['jobs.manage', 'jobApplications.view'],
  custom: [],
};

export const hasPermission = (user, permission) => {
  if (!permission) return true;
  const rolePermissions = ROLE_PERMISSIONS[user?.accessType] || [];
  const explicitPermissions = user?.permissions || [];

  return rolePermissions.includes('*') || rolePermissions.includes(permission) || explicitPermissions.includes(permission);
};

export const hasAnyPermission = (user, permissions = []) =>
  permissions.length === 0 || permissions.some((permission) => hasPermission(user, permission));

export const getDefaultPathForUser = (user) => {
  if (hasPermission(user, 'dashboard.view')) return '/dashboard';
  if (hasPermission(user, 'jobs.manage')) return '/jobs';
  if (hasPermission(user, 'jobApplications.view')) return '/pages/job-applications';
  if (hasPermission(user, 'websiteLeads.manage')) return '/pages/website-leads';
  if (hasPermission(user, 'productEnquiries.view')) return '/pages/product-enquiries';
  if (hasPermission(user, 'eventLeads.view')) return '/pages/event-leads/MATECIA 2025';
  if (hasPermission(user, 'showroomLeads.manage')) return '/showroom-leads';
  if (hasPermission(user, 'products.manage')) return '/ecommerce/inventory';
  if (hasPermission(user, 'blogs.manage')) return '/blogs';
  if (hasPermission(user, 'events.manage')) return '/events';
  if (hasPermission(user, 'showrooms.manage')) return '/showrooms';
  if (hasPermission(user, 'seoMeta.manage')) return '/seo-meta';
  if (hasPermission(user, 'qrCodes.manage')) return '/pages/qr-codes';
  if (hasPermission(user, 'users.manage')) return '/users';
  return '/error-404';
};
