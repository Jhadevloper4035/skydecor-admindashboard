import { lazy, Suspense, useEffect } from 'react'
import FallbackLoading from '@/components/FallbackLoading'
import LogoBox from '@/components/LogoBox'
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient'
import { getMenuItems } from '@/helpers/menu'
import HoverMenuToggle from './components/HoverMenuToggle'
import { useAuthContext } from '@/context/useAuthContext'
import { hasPermission } from '@/constants/access'
import useEventStore from '@/store/eventStore'
const AppMenu = lazy(() => import('./components/AppMenu'))
const VerticalNavigationBar = () => {
  const { user } = useAuthContext()
  const { events, fetchEvents } = useEventStore()
  const canViewEventLeads = hasPermission(user, 'eventLeads.view')
  const menuItems = getMenuItems(user, canViewEventLeads ? events : [])

  useEffect(() => {
    if (canViewEventLeads) fetchEvents()
  }, [canViewEventLeads, fetchEvents])

  return (
    <div className="main-nav" id="leftside-menu-container">
      <LogoBox
        containerClassName="logo-box"
        squareLogo={{
          className: 'logo-sm',
        }}
        textLogo={{
          className: 'logo-lg',
        }}
      />

      <HoverMenuToggle />

      <SimplebarReactClient className="scrollbar">
        <Suspense fallback={<FallbackLoading />}>
          <AppMenu menuItems={menuItems} />
        </Suspense>
      </SimplebarReactClient>
    </div>
  )
}
export default VerticalNavigationBar
