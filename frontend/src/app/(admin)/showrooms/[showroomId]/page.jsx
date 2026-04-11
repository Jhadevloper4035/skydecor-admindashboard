import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Badge, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useShowroomStore from '@/store/showroomStore';

const Field = ({ label, value }) => (
  <div className="mb-3">
    <p className="mb-1 text-muted fs-12 fw-medium text-uppercase">{label}</p>
    <p className="mb-0 fs-14">{value || <span className="text-muted fst-italic">—</span>}</p>
  </div>
);

const IMG_BASE = 'https://skydecor.in/';
const imgSrc = (path) => {
  if (!path) return '';
  return /^https?:\/\//i.test(path) ? path : `${IMG_BASE}${path}`;
};

const ShowroomDetail = () => {
  const { showroomId } = useParams();
  const navigate = useNavigate();
  const { showrooms, loading, fetchShowrooms, deleteShowroom } = useShowroomStore();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchShowrooms();
  }, [fetchShowrooms]);

  const showroom = showrooms.find((s) => s._id === showroomId);

  useEffect(() => {
    if (!loading && showrooms.length > 0 && !showroom) {
      navigate('/pages/error-404-alt');
    }
  }, [loading, showrooms, showroom, navigate]);

  if (loading && !showroom) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  if (!showroom) return null;

  const dateLabel = showroom.date
    ? new Date(showroom.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete showroom?',
      text: `This will permanently delete "${showroom.title}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    setDeleting(true);
    const ok = await deleteShowroom(showroomId);
    if (ok) {
      await Swal.fire({
        title: 'Deleted',
        text: 'The showroom was deleted successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/showrooms');
    } else {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageMetaData title={showroom.title} />
      <PageBreadcrumb title="Showroom Detail" subName="Showrooms" />

      <Row className="g-3">
        {/* Left: cover image + meta */}
        <Col md={4}>
          <Card className="shadow-none border">
            <CardBody className="p-0">
              {showroom.coverImage ? (
                <img
                  src={imgSrc(showroom.coverImage)}
                  alt={showroom.title}
                  className="w-100 rounded-top"
                  style={{ height: 240, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="w-100 d-flex align-items-center justify-content-center text-muted rounded-top bg-light"
                  style={{ height: 240 }}
                >
                  <IconifyIcon icon="bx:store" width={48} height={48} />
                </div>
              )}
              <div className="p-3">
                <Badge bg="primary" className="mb-2">ID: {showroom.id}</Badge>
                <p className="mb-1 text-muted fs-13">
                  <IconifyIcon icon="bx:map-pin" className="me-1" />{showroom.location}
                </p>
                <p className="mb-1 text-muted fs-13">
                  <IconifyIcon icon="bx:calendar" className="me-1" />{dateLabel}
                </p>
                <p className="mb-1 text-muted fs-13">
                  <IconifyIcon icon="bx:link" className="me-1" />/{showroom.slug}
                </p>
                {showroom.contact && (
                  <p className="mb-1 text-muted fs-13">
                    <IconifyIcon icon="bx:phone" className="me-1" />{showroom.contact}
                  </p>
                )}
                {showroom.mail && (
                  <p className="mb-1 text-muted fs-13">
                    <IconifyIcon icon="bx:envelope" className="me-1" />{showroom.mail}
                  </p>
                )}
                <p className="mb-0 text-muted fs-13">
                  <IconifyIcon icon="bx:images" className="me-1" />
                  {showroom.images?.length ?? 0} gallery photo{showroom.images?.length !== 1 ? 's' : ''}
                </p>
              </div>
            </CardBody>
            <div className="border-top p-3 d-flex gap-2 flex-wrap">
              <Link to={`/showrooms/${showroomId}/edit`} className="btn btn-primary flex-fill">
                <IconifyIcon icon="bx:edit" className="me-1" />Edit
              </Link>
              <Link to="/showrooms" className="btn btn-outline-secondary flex-fill">
                <IconifyIcon icon="bx:arrow-back" className="me-1" />Back
              </Link>
              <button
                type="button"
                className="btn btn-danger w-100 mt-1"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting
                  ? <Spinner animation="border" size="sm" className="me-1" />
                  : <IconifyIcon icon="bx:trash" className="me-1" />
                }
                Delete
              </button>
            </div>
          </Card>
        </Col>

        {/* Right: details + gallery */}
        <Col md={8}>
          <Card className="shadow-none border mb-3">
            <CardBody>
              <h5 className="fw-semibold mb-3">{showroom.title}</h5>
              <Row>
                <Col md={6}><Field label="Showroom ID" value={showroom.id} /></Col>
                <Col md={6}><Field label="Date" value={dateLabel} /></Col>
                <Col md={6}><Field label="Location" value={showroom.location} /></Col>
                <Col md={6}><Field label="Slug" value={`/${showroom.slug}`} /></Col>
                <Col md={12}><Field label="Description" value={showroom.description} /></Col>
                <Col md={6}><Field label="Email" value={showroom.mail} /></Col>
                <Col md={6}><Field label="Contact" value={showroom.contact} /></Col>
                <Col md={12}><Field label="Address" value={showroom.address} /></Col>
                {showroom.maplink && (
                  <Col md={12}>
                    <div className="mb-3">
                      <p className="mb-1 text-muted fs-12 fw-medium text-uppercase">Map Link</p>
                      <a href={showroom.maplink} target="_blank" rel="noreferrer" className="fs-14 text-primary">
                        <IconifyIcon icon="bx:map" className="me-1" />Open in Google Maps
                      </a>
                    </div>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>

          {showroom.images?.length > 0 && (
            <Card className="shadow-none border">
              <CardBody>
                <h6 className="fw-semibold mb-3">
                  <IconifyIcon icon="bx:images" className="me-1" />
                  Gallery ({showroom.images.length})
                </h6>
                <Row className="g-2">
                  {showroom.images.map((url, idx) => (
                    <Col xs={6} sm={4} md={3} key={idx}>
                      <div className="border rounded overflow-hidden" style={{ height: 110 }}>
                        <img
                          src={imgSrc(url)}
                          alt={`Photo ${idx + 1}`}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ShowroomDetail;
