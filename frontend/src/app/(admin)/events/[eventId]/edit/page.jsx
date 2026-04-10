import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TextFormInput from '@/components/form/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useEventStore from '@/store/eventStore';

// ── Cover image: shows existing URL preview OR new file preview ───────────────
const CoverImageUpload = ({ existingUrl, newFile, newPreview, onSelect, onRemove }) => {
  const previewSrc = newPreview || existingUrl;

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
      <label className="form-label fw-medium">Cover Image</label>

      {!previewSrc ? (
        <div
          {...getRootProps()}
          className={`dropzone dropzone-custom ${isDragActive ? 'border-primary' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          <input {...getInputProps()} />
          <div className="dz-message text-center py-4">
            <IconifyIcon icon="bx:image-add" width={40} height={40} className="text-muted" />
            <p className="mt-2 mb-1 text-muted">
              {isDragActive ? 'Drop here…' : 'Drag & drop to replace cover image, or click to browse'}
            </p>
          </div>
        </div>
      ) : (
        <div className="position-relative border rounded overflow-hidden" style={{ height: 220, maxWidth: 420 }}>
          <img src={previewSrc} alt="cover" className="w-100 h-100" style={{ objectFit: 'cover', display: 'block' }} />
          <div
            className="position-absolute bottom-0 start-0 end-0 px-2 py-1 fs-12 text-white"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            {newFile ? (
              <><IconifyIcon icon="bx:upload" className="me-1" />New: {newFile.name}</>
            ) : (
              <><IconifyIcon icon="bx:image" className="me-1" />Existing cover image</>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1"
          >
            <IconifyIcon icon="bx:x" />{newFile ? 'Revert' : 'Remove'}
          </button>
        </div>
      )}
    </div>
  );
};

// ── Gallery: existing URL tiles + dropzone to add new files ───────────────────
const GalleryUpload = ({ existingUrls, newItems, onRemoveExisting, onAddNew, onRemoveNew }) => {
  const onDrop = useCallback((accepted) => {
    const newFiles = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    onAddNew(newFiles);
  }, [onAddNew]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const totalCount = existingUrls.length + newItems.length;

  return (
    <div className="mb-3">
      <label className="form-label fw-medium">
        Gallery Images
        <span className="text-muted fw-normal fs-12 ms-2">({totalCount} total)</span>
      </label>

      <div
        {...getRootProps()}
        className={`dropzone dropzone-custom mb-2 ${isDragActive ? 'border-primary' : ''}`}
        style={{ cursor: 'pointer' }}
      >
        <input {...getInputProps()} />
        <div className="dz-message text-center py-3">
          <IconifyIcon icon="bx:cloud-upload" width={36} height={36} className="text-muted" />
          <p className="mt-2 mb-0 text-muted">
            {isDragActive ? 'Drop images here…' : 'Drop new images here or click to add more'}
          </p>
        </div>
      </div>

      {totalCount > 0 && (
        <Row className="g-2 mt-1">
          {/* Existing URL images */}
          {existingUrls.map((url, idx) => (
            <Col xs={6} sm={4} md={3} key={`existing-${idx}`}>
              <div className="position-relative border rounded overflow-hidden" style={{ height: 120 }}>
                <img src={url} alt={`existing ${idx + 1}`} className="w-100 h-100" style={{ objectFit: 'cover', display: 'block' }} />
                <div
                  className="position-absolute bottom-0 start-0 end-0 px-1 py-1 fs-12 text-white text-center"
                  style={{ background: 'rgba(0,0,0,0.45)' }}
                >
                  Saved
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveExisting(idx)}
                  className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0 d-flex align-items-center justify-content-center"
                  style={{ width: 22, height: 22, borderRadius: '50%' }}
                >
                  <IconifyIcon icon="bx:x" />
                </button>
              </div>
            </Col>
          ))}

          {/* New file previews */}
          {newItems.map((img) => (
            <Col xs={6} sm={4} md={3} key={img.id}>
              <div className="position-relative border border-primary rounded overflow-hidden" style={{ height: 120 }}>
                <img src={img.previewUrl} alt={img.file.name} className="w-100 h-100" style={{ objectFit: 'cover', display: 'block' }} />
                <div
                  className="position-absolute bottom-0 start-0 end-0 px-1 py-1 text-truncate fs-12 text-white"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                  <IconifyIcon icon="bx:upload" className="me-1" />New
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveNew(img.id)}
                  className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0 d-flex align-items-center justify-content-center"
                  style={{ width: 22, height: 22, borderRadius: '50%' }}
                >
                  <IconifyIcon icon="bx:x" />
                </button>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

// ── Edit Event page ───────────────────────────────────────────────────────────
const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, loading, fetchEvents, updateEvent } = useEventStore();
  const [saving, setSaving] = useState(false);

  // Cover image state
  const [existingCover, setExistingCover] = useState('');
  const [newCoverFile, setNewCoverFile] = useState(null);
  const [newCoverPreview, setNewCoverPreview] = useState('');

  // Gallery state
  const [existingUrls, setExistingUrls] = useState([]);   // kept existing URLs
  const [newGalleryItems, setNewGalleryItems] = useState([]); // new File objects

  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const event = events.find((e) => e._id === eventId);

  useEffect(() => {
    if (event) {
      reset({
        id:    event.id    ?? '',
        title: event.title ?? '',
        slug:  event.slug  ?? '',
        date:  event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      });
      setExistingCover(event.coverImage ?? '');
      setExistingUrls(event.images ?? []);
    }
  }, [event, reset]);

  useEffect(() => {
    if (!loading && events.length > 0 && !event) {
      navigate('/pages/error-404-alt');
    }
  }, [loading, events, event, navigate]);

  // Cover image handlers
  const handleSelectCover = useCallback((file) => {
    if (newCoverPreview) URL.revokeObjectURL(newCoverPreview);
    setNewCoverFile(file);
    setNewCoverPreview(URL.createObjectURL(file));
  }, [newCoverPreview]);

  const handleRemoveCover = useCallback(() => {
    if (newCoverFile) {
      URL.revokeObjectURL(newCoverPreview);
      setNewCoverFile(null);
      setNewCoverPreview('');
    } else {
      setExistingCover('');
    }
  }, [newCoverFile, newCoverPreview]);

  // Gallery handlers
  const handleRemoveExisting = useCallback((idx) => {
    setExistingUrls((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleAddNew = useCallback((items) => {
    setNewGalleryItems((prev) => [...prev, ...items]);
  }, []);

  const handleRemoveNew = useCallback((id) => {
    setNewGalleryItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const onSubmit = async (values) => {
    setSaving(true);
    const payload = {
      id:         values.id,
      title:      values.title,
      slug:       values.slug,
      date:       values.date,
      // coverImage: new File if selected, else existing URL string
      coverImage: newCoverFile ?? existingCover,
      // images: mix of kept URL strings + new File objects
      // Store handles them separately (keepImages vs images)
      images: [
        ...existingUrls,                      // strings → appended as "keepImages" in store
        ...newGalleryItems.map((i) => i.file), // Files → appended as "images" in store
      ],
    };
    const result = await updateEvent(eventId, payload);
    setSaving(false);
    if (result) navigate(`/events/${eventId}`);
  };

  if (loading && !event) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Edit — ${event?.title ?? ''}`} />
      <PageBreadcrumb title="Edit Event" subName="Events" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
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
                  <Col md={4}>
                    <TextFormInput
                      control={control}
                      name="date"
                      label="Event Date"
                      type="date"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={5}>
                    <TextFormInput
                      control={control}
                      name="title"
                      label="Title"
                      placeholder="e.g. Matecia 2025"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={12}>
                    <TextFormInput
                      control={control}
                      name="slug"
                      label="Slug"
                      placeholder="e.g. matecia-2025"
                      containerClassName="mb-3"
                    />
                  </Col>

                  {/* Cover image */}
                  <Col md={12}>
                    <CoverImageUpload
                      existingUrl={existingCover}
                      newFile={newCoverFile}
                      newPreview={newCoverPreview}
                      onSelect={handleSelectCover}
                      onRemove={handleRemoveCover}
                    />
                  </Col>

                  {/* Gallery */}
                  <Col md={12}>
                    <GalleryUpload
                      existingUrls={existingUrls}
                      newItems={newGalleryItems}
                      onRemoveExisting={handleRemoveExisting}
                      onAddNew={handleAddNew}
                      onRemoveNew={handleRemoveNew}
                    />
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-2">
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving && <Spinner animation="border" size="sm" className="me-1" />}
                    Save Changes
                  </Button>
                  <Link to={`/events/${eventId}`} className="btn btn-outline-secondary">
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

export default EditEvent;
