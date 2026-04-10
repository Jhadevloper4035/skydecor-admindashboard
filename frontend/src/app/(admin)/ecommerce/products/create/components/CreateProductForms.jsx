import { useCallback, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import TextFormInput from '@/components/form/TextFormInput';
import SelectFormInput from '@/components/form/SelectFormInput';
import useProductStore from '@/store/productStore';

const STATUS_OPTIONS = [
  { value: true,  label: 'Active' },
  { value: false, label: 'Inactive' },
];

const MultiImageUpload = ({ images, onAdd, onRemove }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    onAdd(newImages);
  }, [onAdd]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  return (
    <div className="mb-3">
      <label className="form-label">Product Images</label>

      <div
        {...getRootProps()}
        className={`dropzone dropzone-custom mb-3 ${isDragActive ? 'border-primary' : ''}`}
        style={{ cursor: 'pointer' }}
      >
        <input {...getInputProps()} />
        <div className="dz-message text-center py-3">
          <IconifyIcon icon="bx:cloud-upload" width={36} height={36} className="text-muted" />
          <p className="mt-2 mb-1 text-muted">
            {isDragActive ? 'Drop images here…' : 'Drag & drop images, or click to browse'}
          </p>
          <span className="text-muted fs-13">Supports multiple files</span>
        </div>
      </div>

      {images.length > 0 && (
        <Row className="g-2">
          {images.map((img) => (
            <Col xs={6} sm={4} md={3} key={img.id}>
              <div className="position-relative border rounded overflow-hidden" style={{ height: 120 }}>
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => onRemove(img.id)}
                  className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0 d-flex align-items-center justify-content-center"
                  style={{ width: 22, height: 22, borderRadius: '50%' }}
                  title="Remove"
                >
                  <IconifyIcon icon="bx:x" />
                </button>
                <div
                  className="position-absolute bottom-0 start-0 end-0 px-1 py-1 text-truncate fs-12 text-white"
                  style={{ background: 'rgba(0,0,0,0.45)' }}
                >
                  {img.name}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

const CreateProductForms = () => {
  const navigate = useNavigate();
  const { createProduct } = useProductStore();
  const [images, setImages] = useState([]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      productName: '', productCode: '', productType: '', isActive: true,
      category: '', subCategory: '', texture: '', textureCode: '',
      size: '', thickness: '', width: '', pdfUrlPath: '',
    },
  });

  const handleAddImages = useCallback((newImgs) => {
    setImages((prev) => [...prev, ...newImgs]);
  }, []);

  const handleRemoveImage = useCallback((id) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img?.url?.startsWith('blob:')) URL.revokeObjectURL(img.url);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      images: images.map((i) => i.file),
    };
    const result = await createProduct(payload);
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
          <MultiImageUpload
            images={images}
            onAdd={handleAddImages}
            onRemove={handleRemoveImage}
          />
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
