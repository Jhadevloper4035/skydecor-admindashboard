import { useCallback, useState } from 'react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TextFormInput from '@/components/form/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useEventStore from '@/store/eventStore';

// ── Single image dropzone (cover image) ───────────────────────────────────────
const CoverImageUpload = ({ file, previewUrl, onSelect, onRemove }) => {
  const onDrop = useCallback((accepted) => {
    if (accepted.length) onSelect(accepted[0]);
  }, [onSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div className="mb-3">
      <label className="form-label fw-medium">Cover Image <span className="text-danger">*</span></label>

      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={`dropzone dropzone-custom ${isDragActive ? 'border-primary' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          <input {...getInputProps()} />
          <div className="dz-message text-center py-4">
            <IconifyIcon icon="bx:image-add" width={40} height={40} className="text-muted" />
            <p className="mt-2 mb-1 text-muted">
              {isDragActive ? 'Drop cover image here…' : 'Drag & drop cover image, or click to browse'}
            </p>
            <span className="text-muted fs-13">Single file — JPG, PNG, WebP</span>
          </div>
        </div>
      ) : (
        <div className="position-relative border rounded overflow-hidden" style={{ height: 220, maxWidth: 420 }}>
          <img src={previewUrl} alt="cover" className="w-100 h-100" style={{ objectFit: 'cover', display: 'block' }} />
          <div
            className="position-absolute bottom-0 start-0 end-0 px-2 py-1 text-truncate fs-12 text-white"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <IconifyIcon icon="bx:image" className="me-1" />{file?.name}
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1"
          >
            <IconifyIcon icon="bx:x" /> Remove
          </button>
        </div>
      )}
    </div>
  );
};

// ── Multiple image dropzone (gallery) ─────────────────────────────────────────
const GalleryUpload = ({ items, onAdd, onRemove }) => {
  const onDrop = useCallback((accepted) => {
    const newItems = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    onAdd(newItems);
  }, [onAdd]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  return (
    <div className="mb-3">
      <label className="form-label fw-medium">
        Gallery Images <span className="text-danger">*</span>
        <span className="text-muted fw-normal fs-12 ms-2">({items.length} selected)</span>
      </label>

      <div
        {...getRootProps()}
        className={`dropzone dropzone-custom mb-2 ${isDragActive ? 'border-primary' : ''}`}
        style={{ cursor: 'pointer' }}
      >
        <input {...getInputProps()} />
        <div className="dz-message text-center py-3">
          <IconifyIcon icon="bx:cloud-upload" width={36} height={36} className="text-muted" />
          <p className="mt-2 mb-1 text-muted">
            {isDragActive ? 'Drop images here…' : 'Drag & drop multiple images, or click to browse'}
          </p>
          <span className="text-muted fs-13">Supports JPG, PNG, WebP — multiple files</span>
        </div>
      </div>

      {items.length > 0 && (
        <Row className="g-2 mt-1">
          {items.map((img) => (
            <Col xs={6} sm={4} md={3} key={img.id}>
              <div className="position-relative border rounded overflow-hidden" style={{ height: 120 }}>
                <img
                  src={img.previewUrl}
                  alt={img.file.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover', display: 'block' }}
                />
                <button
                  type="button"
                  onClick={() => onRemove(img.id)}
                  className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0 d-flex align-items-center justify-content-center"
                  style={{ width: 22, height: 22, borderRadius: '50%' }}
                >
                  <IconifyIcon icon="bx:x" />
                </button>
                <div
                  className="position-absolute bottom-0 start-0 end-0 px-1 py-1 text-truncate fs-12 text-white"
                  style={{ background: 'rgba(0,0,0,0.45)' }}
                >
                  {img.file.name}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

// ── Create Event page ─────────────────────────────────────────────────────────
const CreateEvent = () => {
  const navigate = useNavigate();
  const { createEvent } = useEventStore();

  // Cover image
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');

  // Gallery images
  const [galleryItems, setGalleryItems] = useState([]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      id: '',
      title: '',
      slug: '',
      date: '',
    },
  });

  const handleSelectCover = useCallback((file) => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }, [coverPreview]);

  const handleRemoveCover = useCallback(() => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview('');
  }, [coverPreview]);

  const handleAddGallery = useCallback((newItems) => {
    setGalleryItems((prev) => [...prev, ...newItems]);
  }, []);

  const handleRemoveGallery = useCallback((id) => {
    setGalleryItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const onSubmit = async (values) => {
    const payload = {
      id:          values.id,
      title:       values.title,
      slug:        values.slug,
      date:        values.date,
      coverImage:  coverFile ?? '',           // File object → sent as "coverImage"
      images:      galleryItems.map((i) => i.file), // File[] → each sent as "images"
    };
    const result = await createEvent(payload);
    if (result) navigate('/events');
  };

  return (
    <>
      <PageMetaData title="Create Event" />
      <PageBreadcrumb title="Create Event" subName="Events" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  {/* Event ID */}
                  <Col md={3}>
                    <TextFormInput
                      control={control}
                      name="id"
                      label="Event ID"
                      type="number"
                      placeholder="e.g. 1"
                      containerClassName="mb-3"
                    />
                  </Col>

                  {/* Date */}
                  <Col md={4}>
                    <TextFormInput
                      control={control}
                      name="date"
                      label="Event Date"
                      type="date"
                      containerClassName="mb-3"
                    />
                  </Col>

                  {/* Title */}
                  <Col md={5}>
                    <TextFormInput
                      control={control}
                      name="title"
                      label="Title"
                      placeholder="e.g. Matecia 2025"
                      containerClassName="mb-3"
                    />
                  </Col>

                  {/* Slug */}
                  <Col md={12}>
                    <TextFormInput
                      control={control}
                      name="slug"
                      label="Slug"
                      placeholder="e.g. matecia-2025 (auto-generated from title if empty)"
                      containerClassName="mb-3"
                    />
                  </Col>

                  {/* Cover image upload */}
                  <Col md={12}>
                    <CoverImageUpload
                      file={coverFile}
                      previewUrl={coverPreview}
                      onSelect={handleSelectCover}
                      onRemove={handleRemoveCover}
                    />
                  </Col>

                  {/* Gallery multi-image upload */}
                  <Col md={12}>
                    <GalleryUpload
                      items={galleryItems}
                      onAdd={handleAddGallery}
                      onRemove={handleRemoveGallery}
                    />
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-2">
                  <button type="submit" className="btn btn-primary">
                    <IconifyIcon icon="bx:check" className="me-1" />
                    Create Event
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/events')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CreateEvent;
