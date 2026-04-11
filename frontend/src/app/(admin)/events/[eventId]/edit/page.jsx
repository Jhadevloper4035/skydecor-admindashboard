import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TextFormInput from '@/components/form/TextFormInput';
import useEventStore from '@/store/eventStore';
import ImageUploader from '@/components/ImageUploader';

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, loading, fetchEvents, updateEvent } = useEventStore();
  const [saving, setSaving] = useState(false);

  const [coverImage, setCoverImage] = useState('');
  const [galleryKeys, setGalleryKeys] = useState([]);

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
      setCoverImage(event.coverImage ?? '');
      setGalleryKeys(event.images ?? []);
    }
  }, [event, reset]);

  useEffect(() => {
    if (!loading && events.length > 0 && !event) {
      navigate('/pages/error-404-alt');
    }
  }, [loading, events, event, navigate]);

  const onSubmit = async (values) => {
    setSaving(true);
    const payload = {
      id:         values.id,
      title:      values.title,
      slug:       values.slug,
      date:       values.date,
      coverImage,
      images:     galleryKeys,
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

                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Cover Image</label>
                      <ImageUploader
                        folder="events"
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
                        folder="events"
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
