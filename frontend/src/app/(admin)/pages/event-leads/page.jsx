import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageMetaData from '@/components/PageTitle'
import { Col, Row, Button } from 'react-bootstrap'

import useEventLeadsStore from '@/store/eventLeadStore'
import EventLeadsTable from './components/EventLeadTable'
import { StatCard } from '../../dashboard/analytics/components/Stats'

const EventLeads = () => {
  const { eventSlug } = useParams()
  const { leads, fetchLeads } = useEventLeadsStore()

  const place = eventSlug

  useEffect(() => {
    fetchLeads(place)
  }, [fetchLeads, place])

  const stats = useMemo(() => {
    const userTypeCounts = leads.reduce((acc, lead) => {
      const key = lead.UserType || lead.userType || 'Unknown'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    const variants = ['primary', 'success', 'danger', 'warning', 'info']
    const userTypeStats = Object.entries(userTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count], idx) => ({
        amount: count.toString(),
        icon: 'iconamoon:profile-circle-duotone',
        variant: variants[idx % variants.length],
        name: type,
      }))

    return [
      {
        amount: leads.length.toString(),
        icon: 'iconamoon:contact-duotone',
        variant: 'primary',
        name: 'Total Leads',
      },
      ...userTypeStats,
    ]
  }, [leads])

  const handleDownloadExcel = () => {
    window.open(`/api/lead/event/download/${place}`, '_blank')
  }

  const handleAddNewLead = async () => {
    window.open(`/api/lead/event/download/${place}`, '_blank')
  }

  return (
    <>
      <PageBreadcrumb subName="Pages" title={`Event Leads - ${place}`} />
      <PageMetaData title={`Event Leads ${place} `} />

   

      <Row className="mb-4">
        {stats.map((stat, idx) => (
          <Col xxl={6} md={6} key={idx}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      <Row className="mb-4 justify-content-end">
        <Col xs="auto">
          <Button variant="primary" className="me-2" onClick={handleAddNewLead}>
            Add New Lead
          </Button>
          <Button variant="success" onClick={handleDownloadExcel}>
            Download Excel
          </Button>
        </Col>
      </Row>

      <EventLeadsTable />
    </>
  )
}

export default EventLeads
