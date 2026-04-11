import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TextFormInput from '@/components/form/TextFormInput';
import useShowroomStore from '@/store/showroomStore';
import ImageUploader from '@/components/ImageUploader';

const EditShowroom = () => {
  const { showroomId } = useParams();
  const navigate = useNavigate();
  const { showrooms, loading, fetchShowrooms, updateShowroom } = useShowroomStore();
  const [saving, setSaving] = useState(false);

  const [coverImage, setCoverImage] = useState('');
  const [galleryKeys, setGalleryKeys] = useState([]);

  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchShowrooms();
  }, [fetchShowrooms]);

  const showroom = showrooms.find((s) => s._id === showroomId);

  useEffect(() => {
    if (showroom) {
      reset({
        id:          showroom.id          ?? '',
        title:       showroom.title       ?? '',
        slug:        showroom.slug        ?? '',
        location:    showroom.location    ?? '',
        description: showroom.description ?? '',
        mail:        showroom.mail        ?? '',
        contact:     showroom.contact     ?? '',
        date:        showroom.date ? new Date(showroom.date).toISOString().split('T')[0] : '',
        maplink:     showroom.maplink     ?? '',
        address:     showroom.address     ?? '',
      });
      setCoverImage(showroom.coverImage ?? '');
      setGalleryKeys(showroom.images ?? []);
    }
  }, [showroom, reset]);

  useEffect(() => {
    if (!loading && showrooms.length > 0 && !showroom) {
      navigate('/pages/error-404-alt');
    }
  }, [loading, showrooms, showroom, navigate]);

  const onSubmit = async (values) => {
    setSaving(true);
    const payload = {
      id:          values.id,
      title:       values.title,
      slug:        values.slug,
      location:    values.location,
      description: values.description,
      mail:        values.mail,
      contact:     values.contact,
      date:        values.date,
      maplink:     values.maplink,
      address:     values.address,
      coverImage,
      images:      galleryKeys,
    };
    const result = await updateShowroom(showroomId, payload);
    setSaving(false);
    if (result) navigate(`/showrooms/${showroomId}`);
  };

  if (loading && !showroom) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Edit — ${showroom?.title ?? ''}`} />
      <PageBreadcrumb title="Edit Showroom" subName="Showrooms" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={2}>
                    <TextFormInput
                      control={control}
                      name="id"
                      label="Showroom ID"
                      type="number"
                      placeholder="e.g. 1"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={3}>
                    <TextFormInput
                      control={control}
                      name="date"
                      label="Date"
                      type="date"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={7}>
                    <TextFormInput
                      control={control}
                      name="title"
                      label="Title"
                      placeholder="e.g. SkyDecor Noida Showroom"
                      containerClassName="mb-3"
                    />
                  </Col>

                  <Col md={6}>
                    <TextFormInput
                      control={control}
                      name="slug"
                      label="Slug"
                      placeholder="e.g. noida-showroom"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={6}>
                    <TextFormInput
                      control={control}
                      name="location"
                      label="Location"
                      placeholder="e.g. Noida, Uttar Pradesh"
                      containerClassName="mb-3"
                    />
                  </Col>

                  <Col md={12}>
                    <TextFormInput
                      control={control}
                      name="description"
                      label="Description"
                      placeholder="Showroom description..."
                      containerClassName="mb-3"
                    />
                  </Col>

                  <Col md={6}>
                    <TextFormInput
                      control={control}
                      name="mail"
                      label="Email"
                      type="email"
                      placeholder="e.g. showroom@skydecor.in"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={6}>
                    <TextFormInput
                      control={control}
                      name="contact"
                      label="Contact"
                      placeholder="e.g. +919876543210"
                      containerClassName="mb-3"
                    />
                  </Col>

                  <Col md={6}>
                    <TextFormInput
                      control={control}
                      name="address"
                      label="Address"
                      placeholder="Full address"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={6}>
                    <TextFormInput
                      control={control}
                      name="maplink"
                      label="Map Link"
                      placeholder="Google Maps URL"
                      containerClassName="mb-3"
                    />
                  </Col>

                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Cover Image</label>
                      <ImageUploader
                        folder="showrooms"
                        multiple={false}
                        value={coverImage ? [coverImage] : []}
                        onComplete={([key]) => setCoverImage(key)}
                        onRemove={() => setCoverImage('')}
                      />
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Gallery Images</label>
                      <ImageUploader
                        folder="showrooms"
                        multiple
                        maxFiles={20}
                        value={galleryKeys}
                        onComplete={(keys) => setGalleryKeys((prev) => [...prev, ...keys])}
                        onRemove={(key) => setGalleryKeys((prev) => prev.filter((k) => k !== key))}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-2">
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving && <Spinner animation="border" size="sm" className="me-1" />}
                    Save Changes
                  </Button>
                  <Link to={`/showrooms/${showroomId}`} className="btn btn-outline-secondary">
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

export default EditShowroom;
