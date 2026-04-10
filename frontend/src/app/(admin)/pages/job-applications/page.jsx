import { useEffect, useMemo, useState } from 'react'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageMetaData from '@/components/PageTitle'
import { Col, Row, Button } from 'react-bootstrap'
import useJobApplicationsStore from '@/store/jobApplicationsStore'
import JobApplicationsTable from './components/JobApplicationsTable'
import { StatCard } from '../../dashboard/analytics/components/Stats'
import { downloadExcel } from '@/helpers/httpClient'

const JobApplications = () => {
  const { leads, fetchLeads } = useJobApplicationsStore()

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const stats = useMemo(() => {
    const deptCounts = leads.reduce((acc, lead) => {
      const key = lead.department || 'General'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    const variants = ['primary', 'success', 'danger', 'warning', 'info']
    const deptStats = Object.entries(deptCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([dept, count], idx) => ({
        amount: count.toString(),
        icon: 'iconamoon:profile-circle-duotone',
        variant: variants[idx % variants.length],
        name: dept,
      }))

    return [
      {
        amount: leads.length.toString(),
        icon: 'iconamoon:contact-duotone',
        variant: 'primary',
        name: 'Total Listings',
      },
      ...deptStats,
    ]
  }, [leads])

  const [downloading, setDownloading] = useState(false)

  const handleDownloadExcel = async () => {
    setDownloading(true)
    try {
      await downloadExcel('/api/lead/job-application/download', 'Job-Applications.xlsx')
    } finally {
      setDownloading(false)
    }
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
          <Button variant="success" onClick={handleDownloadExcel} disabled={downloading}>
            {downloading && <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />}
            {downloading ? 'Preparing...' : 'Download Excel'}
          </Button>
        </Col>
      </Row>

      <JobApplicationsTable />
    </>
  )
}

export default JobApplications
