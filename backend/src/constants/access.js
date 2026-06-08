const VALID_ACCESS_TYPES = [
  "event",
  "admin",
  "showroom",
  "website",
  "superadmin",
  "sales",
  "jobs",
  "custom",
];

const VALID_PERMISSIONS = [
  "dashboard.view",
  "users.manage",
  "products.manage",
  "blogs.manage",
  "events.manage",
  "cisrEvents.manage",
  "showrooms.manage",
  "seoMeta.manage",
  "qrCodes.manage",
  "websiteLeads.manage",
  "productEnquiries.view",
  "jobApplications.view",
  "jobs.manage",
  "eventLeads.view",
  "showroomLeads.manage",
];

const ROLE_PERMISSIONS = {
  superadmin: ["*"],
  admin: ["*"],
  website: [
    "dashboard.view",
    "websiteLeads.manage",
    "productEnquiries.view",
    "jobApplications.view",
    "qrCodes.manage",
  ],
  sales: [
    "dashboard.view",
    "websiteLeads.manage",
    "productEnquiries.view",
    "jobApplications.view",
    "qrCodes.manage",
  ],
  event: ["dashboard.view", "eventLeads.view", "showroomLeads.manage"],
  showroom: ["dashboard.view", "showroomLeads.manage"],
  jobs: ["jobs.manage", "jobApplications.view"],
  custom: [],
};

module.exports = {
  VALID_ACCESS_TYPES,
  VALID_PERMISSIONS,
  ROLE_PERMISSIONS,
};
