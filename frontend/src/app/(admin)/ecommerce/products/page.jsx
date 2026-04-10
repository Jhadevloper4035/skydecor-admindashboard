import { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, Col, Row, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useProductStore from '@/store/productStore';

const ProductCard = ({ product }) => (
  <Col xs={6} sm={4} md={3} xl={2}>
    <Card className="h-100 shadow-none border">
      <div style={{ height: 130, overflow: 'hidden', background: '#f8f9fa' }} className="rounded-top">
        {product.image ? (
          <img
            src={product.image}
            alt={product.productName}
            className="w-100 h-100"
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
            <IconifyIcon icon="bx:image" width={32} height={32} />
          </div>
        )}
      </div>
      <CardBody className="p-2">
        <p className="mb-0 fw-medium fs-13 text-truncate" title={product.productName}>{product.productName}</p>
        <p className="mb-1 text-muted fs-12">{product.productCode}</p>
        <div className="d-flex gap-1 flex-wrap">
          <Badge bg={product.isActive ? 'success' : 'danger'} className="fw-normal">
            {product.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardBody>
      <div className="border-top p-2 d-flex gap-1">
        <Link to={`/ecommerce/products/${product._id}`} className="btn btn-sm btn-soft-info flex-fill py-1" title="View">
          <IconifyIcon icon="bx:show" />
        </Link>
        <Link to={`/ecommerce/products/${product._id}/edit`} className="btn btn-sm btn-soft-secondary flex-fill py-1" title="Edit">
          <IconifyIcon icon="bx:edit" />
        </Link>
        {product.pdfUrlPath && (
          <a href={product.pdfUrlPath} target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-danger flex-fill py-1" title="PDF">
            <IconifyIcon icon="bx:file-pdf" />
          </a>
        )}
      </div>
    </Card>
  </Col>
);

const Products = () => {
  const { products, loading, fetchProducts } = useProductStore();
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.productName?.toLowerCase().includes(q) ||
        p.productCode?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.productType?.toLowerCase().includes(q) ||
        p.subCategory?.toLowerCase().includes(q)
    );
  }, [products, search]);

  // Group: category → productType → subCategory → products[]
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((p) => {
      const cat  = p.category    || 'Uncategorized';
      const type = p.productType || 'Other';
      const sub  = p.subCategory || 'General';
      if (!map[cat]) map[cat] = {};
      if (!map[cat][type]) map[cat][type] = {};
      if (!map[cat][type][sub]) map[cat][type][sub] = [];
      map[cat][type][sub].push(p);
    });
    return map;
  }, [filtered]);

  const toggleCollapse = (key) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <PageMetaData title="Products" />
      <PageBreadcrumb title="Products" subName="Ecommerce" />

      <Card className="mb-3">
        <CardBody>
          <div className="d-flex flex-wrap justify-content-between gap-3">
            <div className="search-bar">
              <span><IconifyIcon icon="bx:search-alt" className="mb-1" /></span>
              <input
                type="search"
                className="form-control"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link to="/ecommerce/products/create" className="btn btn-primary d-flex align-items-center">
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Product
            </Link>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" size="sm" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center text-muted py-5">No products found</div>
      ) : (
        Object.entries(grouped).map(([category, types]) => {
          const catKey = `cat-${category}`;
          const catCount = Object.values(types).flatMap((subs) => Object.values(subs).flat()).length;
          return (
            <Card key={catKey} className="mb-3">
              <CardBody>
                {/* Category header */}
                <div
                  className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom"
                  role="button"
                  onClick={() => toggleCollapse(catKey)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <IconifyIcon
                    icon={collapsed[catKey] ? 'bx:chevron-right' : 'bx:chevron-down'}
                    className="text-muted fs-5"
                  />
                  <h5 className="mb-0 fw-semibold">{category}</h5>
                  <Badge bg="primary" className="fw-normal ms-1">{catCount}</Badge>
                </div>

                {!collapsed[catKey] && Object.entries(types).map(([productType, subs]) => {
                  const typeKey = `${catKey}-type-${productType}`;
                  const typeCount = Object.values(subs).flat().length;
                  return (
                    <div key={typeKey} className="mb-4">
                      {/* Product Type header */}
                      <div
                        className="d-flex align-items-center gap-2 mb-2"
                        role="button"
                        onClick={() => toggleCollapse(typeKey)}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        <IconifyIcon
                          icon={collapsed[typeKey] ? 'bx:chevron-right' : 'bx:chevron-down'}
                          className="text-muted"
                        />
                        <h6 className="mb-0 text-primary">{productType}</h6>
                        <Badge bg="secondary" className="fw-normal">{typeCount}</Badge>
                      </div>

                      {!collapsed[typeKey] && Object.entries(subs).map(([subCategory, items]) => {
                        const subKey = `${typeKey}-sub-${subCategory}`;
                        return (
                          <div key={subKey} className="mb-3 ms-3">
                            {/* Sub Category header */}
                            <div
                              className="d-flex align-items-center gap-2 mb-2"
                              role="button"
                              onClick={() => toggleCollapse(subKey)}
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                              <IconifyIcon
                                icon={collapsed[subKey] ? 'bx:chevron-right' : 'bx:chevron-down'}
                                className="text-muted fs-13"
                              />
                              <span className="fw-medium text-muted fs-13">{subCategory}</span>
                              <Badge bg="light" text="dark" className="fw-normal border">{items.length}</Badge>
                            </div>

                            {!collapsed[subKey] && (
                              <Row className="g-2 ms-1">
                                {items.map((product) => (
                                  <ProductCard key={product._id} product={product} />
                                ))}
                              </Row>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          );
        })
      )}
    </>
  );
};

export default Products;
