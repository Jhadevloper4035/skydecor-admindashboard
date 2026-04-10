import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Badge, Button, Card, CardBody, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { useEffect, useMemo, useState } from 'react'
import useQrCodeStore from '@/store/qrCodeStore'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field) return <IconifyIcon icon="bx:sort" className="ms-1 text-muted opacity-50" />
  return <IconifyIcon icon={sortDir === 'asc' ? 'bx:sort-up' : 'bx:sort-down'} className="ms-1 text-primary" />
}

const statusVariant = (status) => {
  if (status === 'active') return 'success'
  if (status === 'expired') return 'danger'
  return 'secondary'
}

const QrCodesTable = ({ filters }) => {
  const { qrCodes, loading, fetchQrCodes } = useQrCodeStore()
  const [sortField, setSortField] = useState('id')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [previewQr, setPreviewQr] = useState(null)

  useEffect(() => {
    fetchQrCodes()
  }, [fetchQrCodes])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const filtered = useMemo(() => {
    // Default to active only when no filters applied
    const base = qrCodes
    if (!filters) return base.filter((q) => q.status === 'active')

    return base.filter((q) => {
      const contains = (val, search) =>
        String(val ?? '')
          .toLowerCase()
          .includes(String(search).toLowerCase())
      if (filters.productCode && !contains(q.productCode, filters.productCode)) return false
      if (filters.category && q.category !== filters.category) return false
      if (filters.subcategory && q.subcategory !== filters.subcategory) return false
      if (filters.productType && q.productType !== filters.productType) return false
      if (filters.status && q.status !== filters.status) return false
      return true
    })
  }, [qrCodes, filters])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
    setPage(1)
  }

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortField] ?? ''
      const bv = b[sortField] ?? ''
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const cols = [
    { label: '#', field: 'id' },
    { label: 'Product Code', field: 'productCode' },
    { label: 'Product Name', field: 'productName' },
    { label: 'Category', field: 'category' },
    { label: 'Sub Category', field: 'subcategory' },
    { label: 'Type', field: 'productType' },
    { label: 'Scans', field: 'scanCount' },
    { label: 'Status', field: 'status' },
    { label: 'Last Scanned', field: 'lastScannedAt' },
    { label: 'Expires', field: 'expiryDate' },
    { label: 'QR Code', field: null },
    { label: 'Actions', field: null },
  ]

  const activeFilters = filters ? Object.entries(filters).filter(([, v]) => v !== '' && v != null) : []

  return (
    <>
      <Card>
        <CardBody>
          <Row className="align-items-center mb-2">
            <Col xs={12} md="auto" className="d-flex flex-wrap gap-2 align-items-center">
              <span className="fw-semibold fs-5">
                <IconifyIcon icon="bx:qr" className="me-1 text-primary" />
                QR Codes
              </span>
            </Col>
            <Col xs={12} md="auto" className="ms-md-auto mt-2 mt-md-0 d-flex align-items-center gap-2">
              <span className="text-muted small">Rows:</span>
              <Form.Select
                size="sm"
                style={{ width: 80 }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Form.Select>
              <span className="text-muted small">{sorted.length} records</span>
            </Col>
          </Row>

          {activeFilters.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-2">
              {activeFilters.map(([key, val]) => (
                <span key={key} className="badge bg-primary bg-opacity-10 text-primary fw-normal px-2 py-1">
                  <span className="text-muted me-1">{key}:</span>
                  {String(val)}
                </span>
              ))}
            </div>
          )}

          <div className="table-responsive table-centered mt-2">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" size="sm" />
              </div>
            ) : (
              <table className="table text-nowrap mb-0">
                <thead>
                  <tr>
                    {cols.map(({ label, field }) => (
                      <th
                        key={label}
                        onClick={() => field && handleSort(field)}
                        style={{ cursor: field ? 'pointer' : 'default', userSelect: 'none' }}>
                        {label}
                        {field && <SortIcon field={field} sortField={sortField} sortDir={sortDir} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={cols.length} className="text-center text-muted py-4">
                        No QR codes found
                      </td>
                    </tr>
                  ) : (
                    paginated.map((item) => (
                      <tr key={item._id ?? item.id}>
                        <td>
                          <span className="fw-medium">{item.id}</span>
                        </td>
                        <td>
                          <span className="fw-medium">{item.productCode}</span>
                        </td>
                        <td>{item.productName}</td>
                        <td className="text-capitalize">{item.category}</td>
                        <td className="text-capitalize">{item.subcategory}</td>
                        <td className="text-capitalize">{item.productType}</td>
                        <td>
                          <span className="badge bg-info bg-opacity-10 text-info fw-medium">
                            <IconifyIcon icon="bx:scan" className="me-1" />
                            {item.scanCount ?? 0}
                          </span>
                        </td>
                        <td>
                          <Badge bg={statusVariant(item.status)} className="text-capitalize">
                            {item.status}
                          </Badge>
                        </td>
                        <td>{item.lastScannedAt ? new Date(item.lastScannedAt).toLocaleDateString() : <span className="text-muted">Never</span>}</td>
                        <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : <span className="text-muted">No expiry</span>}</td>
                        <td>
                          {item.qrCodeImage ? (
                            <button type="button" className="btn btn-sm btn-soft-primary" title="Preview QR Code" onClick={() => setPreviewQr(item)}>
                              <IconifyIcon icon="bx:qr" className="fs-18" />
                            </button>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            {item.productImageUrl && (
                              <button
                                type="button"
                                className="btn btn-sm btn-soft-info"
                                title="View Product Image"
                                onClick={() => setPreviewQr({ ...item, _previewMode: 'image' })}>
                                <IconifyIcon icon="bx:image" className="fs-18" />
                              </button>
                            )}

                            {item.linkInQrCode && (
                              <a
                                href={item.linkInQrCode}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-soft-secondary"
                                title="Open QR Link">
                                <IconifyIcon icon="bx:link-external" className="fs-18" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="text-muted small">
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
              </span>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(1)}>
                      «
                    </button>
                  </li>
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage((p) => p - 1)}>
                      ‹
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <li key={`ellipsis-${i}`} className="page-item disabled">
                          <span className="page-link">…</span>
                        </li>
                      ) : (
                        <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setPage(p)}>
                            {p}
                          </button>
                        </li>
                      ),
                    )}
                  <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage((p) => p + 1)}>
                      ›
                    </button>
                  </li>
                  <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(totalPages)}>
                      »
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Image Preview Modal — handles both QR code and product image */}
      <Modal show={!!previewQr} onHide={() => setPreviewQr(null)} centered size={previewQr?._previewMode === 'image' ? 'lg' : 'sm'}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6">
            {previewQr?._previewMode === 'image' ? (
              <>
                Product Image — <span className="text-primary">{previewQr?.productCode}</span>
              </>
            ) : (
              <>
                QR Code — <span className="text-primary">{previewQr?.productCode}</span>
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          {previewQr?._previewMode === 'image'
            ? previewQr?.productImageUrl && (
                <img
                  src={previewQr.productImageUrl}
                  alt={previewQr.productName}
                  className="img-fluid rounded"
                  style={{ maxHeight: 420, objectFit: 'contain' }}
                />
              )
            : previewQr?.qrCodeImage && (
                <img src={previewQr.qrCodeImage} alt={`QR Code for ${previewQr.productCode}`} className="img-fluid" style={{ maxWidth: 220 }} />
              )}
          <p className="mt-3 mb-1 fw-medium text-capitalize">{previewQr?.productName}</p>
          <p className="text-muted small mb-0">
            {previewQr?.category} / {previewQr?.subcategory}
          </p>
          <div className="mt-2">
            <Badge bg={statusVariant(previewQr?.status)} className="text-capitalize">
              {previewQr?.status}
            </Badge>
            <span className="ms-2 text-muted small">
              <IconifyIcon icon="bx:scan" className="me-1" />
              {previewQr?.scanCount ?? 0} scans
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center gap-2 py-2">
          {previewQr?._previewMode === 'image'
            ? previewQr?.productImageUrl && (
                <a href={previewQr.productImageUrl} download={`img-${previewQr.productCode}`} className="btn btn-sm btn-primary">
                  <IconifyIcon icon="bx:download" className="me-1" />
                  Download Image
                </a>
              )
            : previewQr?.qrCodeImage && (
                <a href={previewQr.qrCodeImage} download={`qr-${previewQr.productCode}.png`} className="btn btn-sm btn-primary">
                  <IconifyIcon icon="bx:download" className="me-1" />
                  Download QR
                </a>
              )}
          <Button variant="secondary" size="sm" onClick={() => setPreviewQr(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default QrCodesTable
