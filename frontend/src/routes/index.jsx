// @refresh reset
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// Public Routes
const ShowroomLeadForm = lazy(() => import('@/app/(public)/showroom-lead/page'))
const ThankYou = lazy(() => import('@/app/(public)/thank-you/page'))

// Dashboard Routes
const Dashboard = lazy(() => import('@/app/(admin)/dashboard/analytics/page'))

// Ecommerce Routes
const EcommerceProductDetails = lazy(() => import('@/app/(admin)/ecommerce/products/[productId]/page'))
const EcommerceProductCreate = lazy(() => import('@/app/(admin)/ecommerce/products/create/page'))
const EcommerceProductEdit = lazy(() => import('@/app/(admin)/ecommerce/products/[productId]/edit/page'))
const EcommerceInventory = lazy(() => import('@/app/(admin)/ecommerce/inventory/page'))

// Event Routes
const Events = lazy(() => import('@/app/(admin)/events/page'))
const EventCreate = lazy(() => import('@/app/(admin)/events/create/page'))
const EventDetail = lazy(() => import('@/app/(admin)/events/[eventId]/page'))
const EventEdit = lazy(() => import('@/app/(admin)/events/[eventId]/edit/page'))
const CisrEvents = lazy(() => import('@/app/(admin)/cisr-events/page'))
const CisrEventCreate = lazy(() => import('@/app/(admin)/cisr-events/create/page'))
const CisrEventDetail = lazy(() => import('@/app/(admin)/cisr-events/[eventId]/page'))
const CisrEventEdit = lazy(() => import('@/app/(admin)/cisr-events/[eventId]/edit/page'))

// SEO Meta Routes
const SeoMetaList = lazy(() => import('@/app/(admin)/seo-meta/page'))
const SeoMetaCreate = lazy(() => import('@/app/(admin)/seo-meta/create/page'))
const SeoMetaDetail = lazy(() => import('@/app/(admin)/seo-meta/[seoId]/page'))
const SeoMetaEdit = lazy(() => import('@/app/(admin)/seo-meta/[seoId]/edit/page'))

// Showroom Routes
const Showrooms = lazy(() => import('@/app/(admin)/showrooms/page'))
const ShowroomCreate = lazy(() => import('@/app/(admin)/showrooms/create/page'))
const ShowroomDetail = lazy(() => import('@/app/(admin)/showrooms/[showroomId]/page'))
const ShowroomEdit = lazy(() => import('@/app/(admin)/showrooms/[showroomId]/edit/page'))

// Blog Routes
const Blogs = lazy(() => import('@/app/(admin)/blogs/page'))
const BlogCreate = lazy(() => import('@/app/(admin)/blogs/create/page'))
const BlogDetail = lazy(() => import('@/app/(admin)/blogs/[blogId]/page'))
const BlogEdit = lazy(() => import('@/app/(admin)/blogs/[blogId]/edit/page'))

// Job Routes
const Jobs = lazy(() => import('@/app/(admin)/jobs/page'))
const JobCreate = lazy(() => import('@/app/(admin)/jobs/create/page'))
const JobDetail = lazy(() => import('@/app/(admin)/jobs/[jobId]/page'))
const JobEdit = lazy(() => import('@/app/(admin)/jobs/[jobId]/edit/page'))

// Leads Routes
const ShowroomLeads = lazy(() => import('@/app/(admin)/showroom-leads/page'))
const AddShowroomLead = lazy(() => import('@/app/(admin)/showroom-leads/add/page'))
const EventLeads = lazy(() => import('@/app/(admin)/pages/event-leads/page'))
const WebsiteLeads = lazy(() => import('@/app/(admin)/pages/website-leads/page'))
const ProductEnquiries = lazy(() => import('@/app/(admin)/pages/product-enquiries/page'))
const JobApplications = lazy(() => import('@/app/(admin)/pages/job-applications/page'))
const QrCodes = lazy(() => import('@/app/(admin)/pages/qr-codes/page'))

// User Management
const UserManagement = lazy(() => import('@/app/(admin)/users/page'))

// Auth & Error Routes
const AuthSignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'))
const AuthSignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'))
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-pass/page'))
const NotFound = lazy(() => import('@/app/(other)/(error-pages)/error-404/page'))

const initialRoutes = [
  {
    path: '/',
    name: 'root',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '*',
    name: 'not-found',
    element: <NotFound />,
  },
]

// All valid access types — used to gate entry into the admin layout
export const ALL_ACCESS_TYPES = ['event', 'admin', 'showroom', 'website', 'superadmin', 'sales', 'jobs', 'custom']

// superadmin : all routes
// admin      : all routes except user creation
// website    : dashboard + website-related leads (website leads, product enquiries, job apps, QR codes)
// jobs       : job post CRUD + job applications
// event      : dashboard + event leads + showroom leads

const generalRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: <Dashboard />,
    roles: ['admin', 'superadmin', 'event', 'showroom', 'website', 'sales', 'custom'],
    permissions: ['dashboard.view'],
  },
  {
    path: '/dashboard/analytics',
    name: 'Dashboard Redirect',
    element: <Navigate to="/dashboard" />,
  },
]

const appsRoutes = [
  {
    name: 'Product Details',
    path: '/ecommerce/products/:productId',
    element: <EcommerceProductDetails />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['products.manage'],
  },
  {
    name: 'Create Product',
    path: '/ecommerce/products/create',
    element: <EcommerceProductCreate />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['products.manage'],
  },
  {
    name: 'Edit Product',
    path: '/ecommerce/products/:productId/edit',
    element: <EcommerceProductEdit />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['products.manage'],
  },
  {
    name: 'Inventory',
    path: '/ecommerce/inventory',
    element: <EcommerceInventory />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['products.manage'],
  },
]

const customRoutes = [
  {
    name: 'Events',
    path: '/events',
    element: <Events />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['events.manage'],
  },
  {
    name: 'Event Create',
    path: '/events/create',
    element: <EventCreate />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['events.manage'],
  },
  {
    name: 'Event Detail',
    path: '/events/:eventId',
    element: <EventDetail />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['events.manage'],
  },
  {
    name: 'Event Edit',
    path: '/events/:eventId/edit',
    element: <EventEdit />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['events.manage'],
  },
  {
    name: 'CISR Events',
    path: '/cisr-events',
    element: <CisrEvents />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['cisrEvents.manage'],
  },
  {
    name: 'CISR Event Create',
    path: '/cisr-events/create',
    element: <CisrEventCreate />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['cisrEvents.manage'],
  },
  {
    name: 'CISR Event Detail',
    path: '/cisr-events/:eventId',
    element: <CisrEventDetail />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['cisrEvents.manage'],
  },
  {
    name: 'CISR Event Edit',
    path: '/cisr-events/:eventId/edit',
    element: <CisrEventEdit />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['cisrEvents.manage'],
  },
  {
    name: 'Blogs',
    path: '/blogs',
    element: <Blogs />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['blogs.manage'],
  },
  {
    name: 'Blog Create',
    path: '/blogs/create',
    element: <BlogCreate />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['blogs.manage'],
  },
  {
    name: 'Blog Detail',
    path: '/blogs/:blogId',
    element: <BlogDetail />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['blogs.manage'],
  },
  {
    name: 'Blog Edit',
    path: '/blogs/:blogId/edit',
    element: <BlogEdit />,
    roles: ['admin', 'superadmin', 'custom'],
    permissions: ['blogs.manage'],
  },
  {
    name: 'Jobs',
    path: '/jobs',
    element: <Jobs />,
    roles: ['admin', 'superadmin', 'jobs', 'custom'],
    permissions: ['jobs.manage'],
  },
  {
    name: 'Job Create',
    path: '/jobs/create',
    element: <JobCreate />,
    roles: ['admin', 'superadmin', 'jobs', 'custom'],
    permissions: ['jobs.manage'],
  },
  {
    name: 'Job Detail',
    path: '/jobs/:jobId',
    element: <JobDetail />,
    roles: ['admin', 'superadmin', 'jobs', 'custom'],
    permissions: ['jobs.manage'],
  },
  {
    name: 'Job Edit',
    path: '/jobs/:jobId/edit',
    element: <JobEdit />,
    roles: ['admin', 'superadmin', 'jobs', 'custom'],
    permissions: ['jobs.manage'],
  },
  {
    name: 'SEO Meta List',
    path: '/seo-meta',
    element: <SeoMetaList />,
    roles: ['admin', 'superadmin'],
  },
  {
    name: 'SEO Meta Create',
    path: '/seo-meta/create',
    element: <SeoMetaCreate />,
    roles: ['admin', 'superadmin'],
  },
  {
    name: 'SEO Meta Detail',
    path: '/seo-meta/:seoId',
    element: <SeoMetaDetail />,
    roles: ['admin', 'superadmin'],
  },
  {
    name: 'SEO Meta Edit',
    path: '/seo-meta/:seoId/edit',
    element: <SeoMetaEdit />,
    roles: ['admin', 'superadmin'],
  },
  {
    name: 'Showrooms',
    path: '/showrooms',
    element: <Showrooms />,
    roles: ['admin', 'superadmin'],
  },
  {
    name: 'Showroom Create',
    path: '/showrooms/create',
    element: <ShowroomCreate />,
    roles: ['admin', 'superadmin'],
  },
  {
    name: 'Showroom Detail',
    path: '/showrooms/:showroomId',
    element: <ShowroomDetail />,
    roles: ['admin', 'superadmin'],
  },
  {
    name: 'Showroom Edit',
    path: '/showrooms/:showroomId/edit',
    element: <ShowroomEdit />,
    roles: ['admin', 'superadmin'],
  },
  {
    name: 'Showroom Leads',
    path: '/showroom-leads',
    element: <ShowroomLeads />,
    roles: ['admin', 'superadmin', 'event'],
  },
  {
    name: 'Add Showroom Lead',
    path: '/showroom-leads/add',
    element: <AddShowroomLead />,
    roles: ['admin', 'superadmin', 'event'],
  },
  {
    name: 'Website Leads',
    path: '/pages/website-leads',
    element: <WebsiteLeads />,
    roles: ['admin', 'superadmin', 'website', 'sales'],
  },
  {
    name: 'Product Enquiries',
    path: '/pages/product-enquiries',
    element: <ProductEnquiries />,
    roles: ['admin', 'superadmin', 'website', 'sales'],
  },
  {
    name: 'Job Applications',
    path: '/pages/job-applications',
    element: <JobApplications />,
    roles: ['admin', 'superadmin', 'website', 'sales', 'jobs'],
  },
  {
    name: 'QR Codes',
    path: '/pages/qr-codes',
    element: <QrCodes />,
    roles: ['admin', 'superadmin', 'website', 'sales'],
  },
  {
    name: 'Event Leads',
    path: '/pages/event-leads/:eventSlug',
    element: <EventLeads />,
    roles: ['admin', 'superadmin', 'event'],
  },
]

export const authRoutes = [
  {
    path: '/auth/sign-in',
    name: 'Sign In',
    element: <AuthSignIn />,
  },
  {
    name: 'Reset Password',
    path: '/auth/reset-pass',
    element: <ResetPassword />,
  },
  {
    name: '404 Error',
    path: '/error-404',
    element: <NotFound />,
  },
]

export const appRoutes = [
  ...initialRoutes,
  ...generalRoutes,
  ...appsRoutes,
  ...customRoutes,
  // User management — superadmin only
  {
    name: 'User Management',
    path: '/users',
    element: <UserManagement />,
    roles: ['superadmin'],
  },
  {
    name: 'Create User',
    path: '/auth/sign-up',
    element: <AuthSignUp />,
    roles: ['superadmin'],
  },
  ...authRoutes,
]

// Public routes — no auth, no admin layout
export const publicRoutes = [
  {
    name: 'Showroom Lead Form',
    path: '/showroom-lead',
    element: <ShowroomLeadForm />,
  },
  {
    name: 'Event Lead Form',
    path: '/event-lead/:eventSlug',
    element: <ShowroomLeadForm />,
  },
  {
    name: 'Thank You',
    path: '/thank-you',
    element: <ThankYou />,
  },
]
