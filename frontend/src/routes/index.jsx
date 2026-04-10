// @refresh reset
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// Dashboard Routes
const Analytics = lazy(() => import('@/app/(admin)/dashboard/analytics/page'))
const Finance = lazy(() => import('@/app/(admin)/dashboard/finance/page'))
const Sales = lazy(() => import('@/app/(admin)/dashboard/sales/page'))

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

// Leads Routes
const ShowroomLeads = lazy(() => import('@/app/(admin)/showroom-leads/page'))
const EventLeads = lazy(() => import('@/app/(admin)/pages/event-leads/page'))
const WebsiteLeads = lazy(() => import('@/app/(admin)/pages/website-leads/page'))
const ProductEnquiries = lazy(() => import('@/app/(admin)/pages/product-enquiries/page'))
const JobApplications = lazy(() => import('@/app/(admin)/pages/job-applications/page'))
const QrCodes = lazy(() => import('@/app/(admin)/pages/qr-codes/page'))

// Auth & Error Routes
const AuthSignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'))
const AuthSignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'))
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-pass/page'))
const NotFound = lazy(() => import('@/app/(other)/(error-pages)/error-404/page'))

const initialRoutes = [
  {
    path: '/',
    name: 'root',
    element: <Navigate to="/dashboard/analytics" />,
  },
  {
    path: '*',
    name: 'not-found',
    element: <NotFound />,
  },
]

const generalRoutes = [
  {
    path: '/dashboard/analytics',
    name: 'Analytics',
    element: <Analytics />,
  },
  {
    path: '/dashboard/finance',
    name: 'Finance',
    element: <Finance />,
  },
  {
    path: '/dashboard/sales',
    name: 'Sales',
    element: <Sales />,
  },
]

const appsRoutes = [
  {
    name: 'Product Details',
    path: '/ecommerce/products/:productId',
    element: <EcommerceProductDetails />,
  },
  {
    name: 'Create Product',
    path: '/ecommerce/products/create',
    element: <EcommerceProductCreate />,
  },
  {
    name: 'Edit Product',
    path: '/ecommerce/products/:productId/edit',
    element: <EcommerceProductEdit />,
  },
  {
    name: 'Inventory',
    path: '/ecommerce/inventory',
    element: <EcommerceInventory />,
  },
]

const customRoutes = [
  {
    name: 'Events',
    path: '/events',
    element: <Events />,
  },
  {
    name: 'Event Create',
    path: '/events/create',
    element: <EventCreate />,
  },
  {
    name: 'Event Detail',
    path: '/events/:eventId',
    element: <EventDetail />,
  },
  {
    name: 'Event Edit',
    path: '/events/:eventId/edit',
    element: <EventEdit />,
  },
  {
    name: 'Blogs',
    path: '/blogs',
    element: <Blogs />,
  },
  {
    name: 'Blog Create',
    path: '/blogs/create',
    element: <BlogCreate />,
  },
  {
    name: 'Blog Detail',
    path: '/blogs/:blogId',
    element: <BlogDetail />,
  },
  {
    name: 'Blog Edit',
    path: '/blogs/:blogId/edit',
    element: <BlogEdit />,
  },
  {
    name: 'SEO Meta List',
    path: '/seo-meta',
    element: <SeoMetaList />,
  },
  {
    name: 'SEO Meta Create',
    path: '/seo-meta/create',
    element: <SeoMetaCreate />,
  },
  {
    name: 'SEO Meta Detail',
    path: '/seo-meta/:seoId',
    element: <SeoMetaDetail />,
  },
  {
    name: 'SEO Meta Edit',
    path: '/seo-meta/:seoId/edit',
    element: <SeoMetaEdit />,
  },
  {
    name: 'Showrooms',
    path: '/showrooms',
    element: <Showrooms />,
  },
  {
    name: 'Showroom Create',
    path: '/showrooms/create',
    element: <ShowroomCreate />,
  },
  {
    name: 'Showroom Detail',
    path: '/showrooms/:showroomId',
    element: <ShowroomDetail />,
  },
  {
    name: 'Showroom Edit',
    path: '/showrooms/:showroomId/edit',
    element: <ShowroomEdit />,
  },
  {
    name: 'Showroom Leads',
    path: '/showroom-leads',
    element: <ShowroomLeads />,
  },
  {
    name: 'Website Leads',
    path: '/pages/website-leads',
    element: <WebsiteLeads />,
  },
  {
    name: 'Product Enquiries',
    path: '/pages/product-enquiries',
    element: <ProductEnquiries />,
  },
  {
    name: 'Job Applications',
    path: '/pages/job-applications',
    element: <JobApplications />,
  },
  {
    name: 'QR Codes',
    path: '/pages/qr-codes',
    element: <QrCodes />,
  },
  {
    name: 'Event Leads',
    path: '/pages/event-leads/:eventSlug',
    element: <EventLeads />,
  },
]

export const authRoutes = [
  {
    path: '/auth/sign-in',
    name: 'Sign In',
    element: <AuthSignIn />,
  },
  {
    name: 'Sign Up',
    path: '/auth/sign-up',
    element: <AuthSignUp />,
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
  ...authRoutes,
]
