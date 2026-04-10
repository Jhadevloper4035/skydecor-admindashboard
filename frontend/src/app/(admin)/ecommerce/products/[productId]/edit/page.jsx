import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardBody, Col, Row, Spinner, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TextFormInput from '@/components/form/TextFormInput';
import SelectFormInput from '@/components/form/SelectFormInput';
import useProductStore from '@/store/productStore';

const STATUS_OPTIONS = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, loading, fetchProducts, updateProduct } = useProductStore();
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const product = products.find((p) => p._id === productId);

  useEffect(() => {
    if (product) {
      reset({
        productName:  product.productName  ?? '',
        productCode:  product.productCode  ?? '',
        productType:  product.productType  ?? '',
        category:     product.category     ?? '',
        subCategory:  product.subCategory  ?? '',
        texture:      product.texture      ?? '',
        textureCode:  product.textureCode  ?? '',
        size:         product.size         ?? '',
        thickness:    product.thickness    ?? '',
        width:        product.width        ?? '',
        image:        product.image        ?? '',
        pdfUrlPath:   product.pdfUrlPath   ?? '',
        isActive:     product.isActive     ?? true,
      });
    }
  }, [product, reset]);

  useEffect(() => {
    if (!loading && products.length > 0 && !product) {
      navigate('/pages/error-404-alt');
    }
  }, [loading, products, product, navigate]);

  const onSubmit = async (values) => {
    setSaving(true);
    const result = await updateProduct(productId, values);
    setSaving(false);
    if (result) navigate(`/ecommerce/products/${productId}`);
  };

  if (loading && !product) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb title="Edit Product" subName="Ecommerce" />
      <PageMetaData title={`Edit — ${product?.productName ?? ''}`} />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
                    <TextFormInput control={control} name="productName" label="Product Name" placeholder="e.g. SDA 2002" containerClassName="mb-3" />
                  </Col>
                  <Col md={6}>
                    <TextFormInput control={control} name="productCode" label="Product Code" placeholder="e.g. SDA-2002" containerClassName="mb-3" />
                  </Col>
                  <Col md={6}>
                    <TextFormInput control={control} name="productType" label="Product Type" placeholder="e.g. Acrylish" containerClassName="mb-3" />
                  </Col>
                  <Col md={6}>
                    <SelectFormInput control={control} name="isActive" label="Status" options={STATUS_OPTIONS} containerClassName="mb-3" />
                  </Col>
                  <Col md={6}>
                    <TextFormInput control={control} name="category" label="Category" placeholder="e.g. Plain" containerClassName="mb-3" />
                  </Col>
                  <Col md={6}>
                    <TextFormInput control={control} name="subCategory" label="Sub Category" placeholder="e.g. Plain" containerClassName="mb-3" />
                  </Col>
                  <Col md={4}>
                    <TextFormInput control={control} name="texture" label="Texture" placeholder="e.g. Flute Glass" containerClassName="mb-3" />
                  </Col>
                  <Col md={4}>
                    <TextFormInput control={control} name="textureCode" label="Texture Code" placeholder="e.g. FGL" containerClassName="mb-3" />
                  </Col>
                  <Col md={4}>
                    <TextFormInput control={control} name="size" label="Size" placeholder="e.g. 4ft x 8ft" containerClassName="mb-3" />
                  </Col>
                  <Col md={4}>
                    <TextFormInput control={control} name="thickness" label="Thickness" placeholder="e.g. 3mm" containerClassName="mb-3" />
                  </Col>
                  <Col md={4}>
                    <TextFormInput control={control} name="width" label="Width" placeholder="e.g. 1220mm" containerClassName="mb-3" />
                  </Col>
                  <Col md={12}>
                    <TextFormInput control={control} name="image" label="Image URL" placeholder="https://..." containerClassName="mb-3" />
                  </Col>
                  <Col md={12}>
                    <TextFormInput control={control} name="pdfUrlPath" label="PDF URL" placeholder="https://..." containerClassName="mb-3" />
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-2">
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? <Spinner animation="border" size="sm" className="me-1" /> : null}
                    Save Changes
                  </Button>
                  <Link to={`/ecommerce/products/${productId}`} className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EditProduct;
