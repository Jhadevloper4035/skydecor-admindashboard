import { Col, Row, Card } from 'react-bootstrap';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import TextFormInput from '@/components/form/TextFormInput';

const DimensionsMediaForm = ({ control, setValue, watch }) => {
  const imageValue = watch('image');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setValue('image', objectUrl, { shouldValidate: true });
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  return (
    <Row className="mt-3">
      <Col md={4}>
        <TextFormInput control={control} name="size"      label="Size"      placeholder="e.g. 4ft x 8ft" containerClassName="mb-3" />
      </Col>
      <Col md={4}>
        <TextFormInput control={control} name="thickness" label="Thickness" placeholder="e.g. 3mm"       containerClassName="mb-3" />
      </Col>
      <Col md={4}>
        <TextFormInput control={control} name="width"     label="Width"     placeholder="e.g. 1220mm"    containerClassName="mb-3" />
      </Col>

      <Col md={12}>
        <label className="form-label">Product Image</label>
        <div
          {...getRootProps()}
          className={`dropzone dropzone-custom mb-2 ${isDragActive ? 'border-primary' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          <input {...getInputProps()} />
          <div className="dz-message text-center py-3">
            <IconifyIcon icon="bx:cloud-upload" width={36} height={36} className="text-muted" />
            <p className="mt-2 mb-0 text-muted">
              {isDragActive ? 'Drop image here…' : 'Drag & drop an image, or click to browse'}
            </p>
          </div>
        </div>

        {imageValue && (
          <Card className="mb-3 p-2 border">
            <div className="d-flex align-items-center gap-3">
              <img
                src={imageValue}
                alt="preview"
                className="rounded"
                style={{ width: 80, height: 80, objectFit: 'cover' }}
              />
              <div className="flex-grow-1">
                <p className="mb-1 small text-muted fw-medium">Preview</p>
                <p className="mb-0 small text-truncate" style={{ maxWidth: 300 }}>{imageValue}</p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-soft-danger"
                onClick={() => setValue('image', '')}
              >
                <IconifyIcon icon="bx:x" />
              </button>
            </div>
          </Card>
        )}

        <TextFormInput
          control={control}
          name="image"
          label="Or enter Image URL"
          placeholder="https://skydecor.in/products/..."
          containerClassName="mb-3"
        />
      </Col>

      <Col md={12}>
        <TextFormInput
          control={control}
          name="pdfUrlPath"
          label="PDF URL"
          placeholder="https://skydecor.s3.ap-south-1.amazonaws.com/..."
          containerClassName="mb-3"
        />
      </Col>
    </Row>
  );
};

export default DimensionsMediaForm;
