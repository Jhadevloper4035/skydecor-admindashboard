import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageMetaData from '@/components/PageTitle'
import FilterQrCodes from './components/FilterQrCodes'
import QrCodesTable from './components/QrCodesTable'

const QrCodes = () => {
  const [filters, setFilters] = useState(null)

  return (
    <>
      <PageBreadcrumb subName="Website Apps" title="QR Codes" />
      <PageMetaData title="QR Codes" />
      <Row>
        <Col xs={12}>
          <FilterQrCodes onFilter={setFilters} />
        </Col>
        <Col xs={12}>
          <QrCodesTable filters={filters} />
        </Col>
      </Row>
    </>
  )
}

export default QrCodes
