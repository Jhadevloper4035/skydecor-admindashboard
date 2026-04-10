import { useEffect, useMemo } from 'react'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageMetaData from '@/components/PageTitle'
import useShowroomLeadsStore from '@/store/showroomLeadsStore'
import ShowroomLeadsTable from './components/ShowroomLeadsTable'
import { Col, Row, Button } from 'react-bootstrap'
import { StatCard } from '../dashboard/analytics/components/Stats'


const ShowroomLeads = () => {
  const { leads, fetchLeads } = useShowroomLeadsStore()

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

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
    window.open('/api/lead/showroom/download', '_blank')
  }

  const handleAddNewLead = async () => {
    const fullName = window.prompt('Enter lead full name:', 'New Lead')
    const mobileNumber = window.prompt('Enter mobile number:', '9999999999')
    if (!fullName || !mobileNumber) return

    const userType = window.prompt('Enter user type:', 'End Customer') || 'Unknown'
    const email = window.prompt('Enter email:', 'example@example.com') || ''

    try {
      const res = await fetch('/api/lead/showroom/contact-form-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          mobileNumber,
          userType,
          productType: ['New Lead'],
          companyName: '',
          city: '',
          state: '',
          representative: '',
        }),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => null)
        throw new Error(error?.message || `Failed to add lead (${res.status})`)
      }

      await fetchLeads(true)
      window.alert('New showroom lead added successfully.')
    } catch (err) {
      window.alert(err.message || 'Failed to add new lead')
    }
  }

  return (
    <>
      <PageBreadcrumb subName="Pages" title="Showroom Leads" />
      <PageMetaData title="Showroom Leads" />

        {/* <LeadHero /> */}

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


    

      <ShowroomLeadsTable />
    </>
  )
}

export default ShowroomLeads
