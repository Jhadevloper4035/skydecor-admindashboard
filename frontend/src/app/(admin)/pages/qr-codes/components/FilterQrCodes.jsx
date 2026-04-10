import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Button, Card, CardBody, Col, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useQrCodeStore from '@/store/qrCodeStore'
import { useMemo } from 'react'

const toOptions = (arr) => [
  { value: '', label: 'All' },
  ...arr.map((v) => ({ value: v, label: v })),
]

const uniq = (items, key) => [...new Set(items.map((p) => p[key]).filter(Boolean))].sort()

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'expired', label: 'Expired' },
]

const FilterQrCodes = ({ onFilter }) => {
  const { qrCodes } = useQrCodeStore()

  const opts = useMemo(() => ({
    category:    toOptions(uniq(qrCodes, 'category')),
    subcategory: toOptions(uniq(qrCodes, 'subcategory')),
    productType: toOptions(uniq(qrCodes, 'productType')),
  }), [qrCodes])

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      productCode: '', category: '',
      subcategory: '', productType: '', status: 'active',
    },
  })

  const onSubmit = (values) => {
    if (onFilter) onFilter(values)
  }

  const handleReset = () => {
    reset()
    if (onFilter) onFilter(null)
  }

  return (
    <Card className="mb-3">
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="g-2 align-items-end">

            <Col xs={12} sm={6} md={4} lg={2}>
              <Form.Label className="mb-1 small fw-medium">Product Code</Form.Label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">
                  <IconifyIcon icon="bx:search-alt" />
                </span>
                <Form.Control size="sm" placeholder="e.g. SDA-2002" {...register('productCode')} />
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2}>
              <Form.Label className="mb-1 small fw-medium">Category</Form.Label>
              <Form.Select size="sm" {...register('category')}>
                {opts.category.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2}>
              <Form.Label className="mb-1 small fw-medium">Sub Category</Form.Label>
              <Form.Select size="sm" {...register('subcategory')}>
                {opts.subcategory.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2}>
              <Form.Label className="mb-1 small fw-medium">Product Type</Form.Label>
              <Form.Select size="sm" {...register('productType')}>
                {opts.productType.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2}>
              <Form.Label className="mb-1 small fw-medium">Status</Form.Label>
              <Form.Select size="sm" {...register('status')}>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2} className="d-flex gap-2">
              <Button variant="outline-secondary" size="sm" type="button" className="w-100" onClick={handleReset}>
                Clear
              </Button>
              <Button variant="primary" size="sm" type="submit" className="w-100">
                Apply
              </Button>
            </Col>

          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}

export default FilterQrCodes
