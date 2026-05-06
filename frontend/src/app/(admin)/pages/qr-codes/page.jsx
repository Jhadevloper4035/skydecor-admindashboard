import { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageMetaData from '@/components/PageTitle'
import FilterQrCodes from './components/FilterQrCodes'
import QrCodesTable from './components/QrCodesTable'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { downloadExcel } from '@/helpers/httpClient'

const QrCodes = () => {
  const [filters, setFilters] = useState(null)
  const [downloading, setDownloading] = useState(false)

  const handleDownloadExcel = async () => {
    setDownloading(true)
    try {
      await downloadExcel('/api/qr-code/download', 'QR-Codes.xlsx')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <PageBreadcrumb subName="Website Apps" title="QR Codes" />
      <PageMetaData title="QR Codes" />
      <Row>
        <Col xs={12}>
          <FilterQrCodes onFilter={setFilters} />
        </Col>
        <Col xs={12} className="mb-3 d-flex justify-content-end">
          <Button variant="success" onClick={handleDownloadExcel} disabled={downloading}>
            {downloading ? (
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
            ) : (
              <IconifyIcon icon="bx:export" className="me-1 icons-center" />
            )}
            {downloading ? 'Preparing...' : 'Export Excel'}
          </Button>
        </Col>
        <Col xs={12}>
          <QrCodesTable filters={filters} />
        </Col>
      </Row>
    </>
  )
}

export default QrCodes
