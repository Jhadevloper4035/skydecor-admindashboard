import { useEffect, useMemo } from 'react'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageMetaData from '@/components/PageTitle'
import { Col, Row, Button } from 'react-bootstrap'
import useJobApplicationsStore from '@/store/jobApplicationsStore'
import JobApplicationsTable from './components/JobApplicationsTable'
import { StatCard } from '../../dashboard/analytics/components/Stats'

const JobApplications = () => {
  const { leads, fetchLeads } = useJobApplicationsStore()

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const stats = useMemo(() => {
    const positionCounts = leads.reduce((acc, lead) => {
      const key = lead.position || 'Unknown'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    const variants = ['primary', 'success', 'danger', 'warning', 'info']
    const positionStats = Object.entries(positionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([position, count], idx) => ({
        amount: count.toString(),
        icon: 'iconamoon:profile-circle-duotone',
        variant: variants[idx % variants.length],
        name: position,
      }))

    return [
      {
        amount: leads.length.toString(),
        icon: 'iconamoon:contact-duotone',
        variant: 'primary',
        name: 'Total Applications',
      },
      ...positionStats,
    ]
  }, [leads])

  const handleDownloadExcel = () => {
    window.open('/api/lead/job-application/download', '_blank')
  }

  return (
    <>
      <PageBreadcrumb subName="Website Apps" title="Job Applications" />
      <PageMetaData title="Job Applications" />

      <Row className="mb-4">
        {stats.map((stat, idx) => (
          <Col xxl={6} md={6} key={idx}>
            <StatCard {...stat} />
          </Col>
        ))}
      </Row>

      <Row className="mb-4 justify-content-end">
        <Col xs="auto">
          <Button variant="success" onClick={handleDownloadExcel}>
            Download Excel
          </Button>
        </Col>
      </Row>

      <JobApplicationsTable />
    </>
  )
}

export default JobApplications
