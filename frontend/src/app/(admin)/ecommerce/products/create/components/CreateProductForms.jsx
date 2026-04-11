import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import TextFormInput from '@/components/form/TextFormInput';
import SelectFormInput from '@/components/form/SelectFormInput';
import useProductStore from '@/store/productStore';
import ImageUploader from '@/components/ImageUploader';

const STATUS_OPTIONS = [
  { value: true,  label: 'Active' },
  { value: false, label: 'Inactive' },
];

const CreateProductForms = () => {
  const navigate = useNavigate();
  const { createProduct } = useProductStore();
  const [productImage, setProductImage] = useState('');

  const { control, handleSubmit } = useForm({
    defaultValues: {
      productName: '', productCode: '', productType: '', isActive: true,
      category: '', subCategory: '', texture: '', textureCode: '',
      size: '', thickness: '', width: '', pdfUrlPath: '',
    },
  });

  const onSubmit = async (values) => {
    const result = await createProduct({ ...values, image: productImage });
    if (result) navigate('/ecommerce/products');
  };

  return (
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
        <Col md={6}>
          <TextFormInput control={control} name="texture" label="Texture" placeholder="e.g. Flute Glass" containerClassName="mb-3" />
        </Col>
        <Col md={6}>
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
          <div className="mb-3">
            <label className="form-label">Product Image</label>
            <ImageUploader
              folder="products"
              multiple={false}
              value={productImage ? [productImage] : []}
              onComplete={([key]) => setProductImage(key)}
              onRemove={() => setProductImage('')}
            />
          </div>
        </Col>

        <Col md={12}>
          <TextFormInput control={control} name="pdfUrlPath" label="PDF URL" placeholder="https://skydecor.s3.ap-south-1.amazonaws.com/..." containerClassName="mb-3" />
        </Col>
      </Row>

      <div className="d-flex gap-2 mt-1">
        <button type="submit" className="btn btn-primary">
          <IconifyIcon icon="bx:check" className="me-1" />
          Create Product
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/ecommerce/products')}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateProductForms;
