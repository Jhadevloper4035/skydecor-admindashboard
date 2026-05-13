import { useState } from 'react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TextFormInput from '@/components/form/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ImageUploader from '@/components/ImageUploader';
import useCisrEventStore from '@/store/cisrEventStore';

const CreateCisrEvent = () => {
  const navigate = useNavigate();
  const { createEvent } = useCisrEventStore();

  const [coverImage, setCoverImage] = useState('');
  const [galleryKeys, setGalleryKeys] = useState([]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      id: '',
      title: '',
      slug: '',
      date: '',
    },
  });

  const onSubmit = async (values) => {
    const payload = {
      id: values.id,
      title: values.title,
      slug: values.slug,
      date: values.date,
      coverImage,
      images: galleryKeys,
    };
    const result = await createEvent(payload);
    if (result) navigate('/cisr-events');
  };

  return (
    <>
      <PageMetaData title="Create CISR Event" />
      <PageBreadcrumb title="Create CISR Event" subName="CISR Events" />

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
                      label="CISR Event ID"
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 1"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={4}>
                    <TextFormInput
                      control={control}
                      name="date"
                      label="CISR Event Date"
                      type="date"
                      required
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={5}>
                    <TextFormInput
                      control={control}
                      name="title"
                      label="Title"
                      required
                      placeholder="e.g. CISR 2025"
                      containerClassName="mb-3"
                    />
                  </Col>
                  <Col md={12}>
                    <TextFormInput
                      control={control}
                      name="slug"
                      label="Slug"
                      placeholder="e.g. cisr-2025 (auto-generated from title if empty)"
                      containerClassName="mb-3"
                    />
                  </Col>

                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Cover Image <span className="text-danger">*</span>
                      </label>
                      <ImageUploader
                        folder="cisr-events"
                        multiple={false}
                        value={coverImage ? [coverImage] : []}
                        onComplete={([key]) => setCoverImage(key)}
                        onRemove={() => setCoverImage('')}
                      />
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Gallery Images <span className="text-danger">*</span>
                      </label>
                      <ImageUploader
                        folder="cisr-events"
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
                  <button type="submit" className="btn btn-primary">
                    <IconifyIcon icon="bx:check" className="me-1" />
                    Create CISR Event
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/cisr-events')}
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

export default CreateCisrEvent;
