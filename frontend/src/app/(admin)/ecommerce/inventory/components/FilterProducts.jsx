import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Button, Card, CardBody, Col, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import useProductStore from '@/store/productStore'
import { useMemo } from 'react'

const toOptions = (arr) => [
  { value: '', label: 'All' },
  ...arr.map((v) => ({ value: v, label: v })),
]

const uniq = (items, key) => [...new Set(items.map((p) => p[key]).filter(Boolean))].sort()

const FilterProducts = ({ onFilter }) => {
  const { products } = useProductStore()

  const opts = useMemo(() => ({
    productType: toOptions(uniq(products, 'productType')),
    category:    toOptions(uniq(products, 'category')),
    subCategory: toOptions(uniq(products, 'subCategory')),
  }), [products])

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      productCode: '', productType: '',
      category: '', subCategory: '',
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

            <Col xs={12} sm={6} md={4} lg={3}>
              <Form.Label className="mb-1 small fw-medium">Product Code</Form.Label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">
                  <IconifyIcon icon="bx:search-alt" />
                </span>
                <Form.Control size="sm" placeholder="e.g. SDA-2002" {...register('productCode')} />
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={3}>
              <Form.Label className="mb-1 small fw-medium">Product Type</Form.Label>
              <Form.Select size="sm" {...register('productType')}>
                {opts.productType.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={4} lg={3}>
              <Form.Label className="mb-1 small fw-medium">Category</Form.Label>
              <Form.Select size="sm" {...register('category')}>
                {opts.category.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={4} lg={3}>
              <Form.Label className="mb-1 small fw-medium">Sub Category</Form.Label>
              <Form.Select size="sm" {...register('subCategory')}>
                {opts.subCategory.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={4} lg={3} className="d-flex gap-2">
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

export default FilterProducts
