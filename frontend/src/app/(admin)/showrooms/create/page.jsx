import { useState } from 'react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import TextFormInput from '@/components/form/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useShowroomStore from '@/store/showroomStore';
import ImageUploader from '@/components/ImageUploader';

const CreateShowroom = () => {
  const navigate = useNavigate();
  const { createShowroom } = useShowroomStore();

  const [coverImage, setCoverImage] = useState('');
  const [galleryKeys, setGalleryKeys] = useState([]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      id: '',
      title: '',
      slug: '',
      location: '',
      description: '',
      mail: '',
      contact: '',
      date: '',
      maplink: '',
      address: '',
    },
  });

  const onSubmit = async (values) => {
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
    const result = await createShowroom(payload);
    if (result) navigate('/showrooms');
  };

  return (
    <>
      <PageMetaData title="Create Showroom" />
      <PageBreadcrumb title="Create Showroom" subName="Showrooms" />

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
                        onComplete={([key]) => setCoverImage(key)}
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
                        onComplete={(keys) => setGalleryKeys((prev) => [...prev, ...keys])}
                      />
                    </div>
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-2">
                  <button type="submit" className="btn btn-primary">
                    <IconifyIcon icon="bx:check" className="me-1" />
                    Create Showroom
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/showrooms')}
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

export default CreateShowroom;
