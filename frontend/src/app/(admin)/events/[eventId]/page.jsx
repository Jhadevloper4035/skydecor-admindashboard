import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Badge, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useEventStore from '@/store/eventStore';

const Field = ({ label, value }) => (
  <div className="mb-3">
    <p className="mb-1 text-muted fs-12 fw-medium text-uppercase">{label}</p>
    <p className="mb-0 fs-14">{value || <span className="text-muted fst-italic">—</span>}</p>
  </div>
);

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, loading, fetchEvents, deleteEvent } = useEventStore();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const event = events.find((e) => e._id === eventId);

  useEffect(() => {
    if (!loading && events.length > 0 && !event) {
      navigate('/pages/error-404-alt');
    }
  }, [loading, events, event, navigate]);

  if (loading && !event) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  if (!event) return null;

  const dateLabel = event.date
    ? new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete event?',
      text: `This will permanently delete "${event.title}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    setDeleting(true);
    const ok = await deleteEvent(eventId);
    if (ok) {
      await Swal.fire({
        title: 'Deleted',
        text: 'The event was deleted successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/events');
    } else {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageMetaData title={event.title} />
      <PageBreadcrumb title="Event Detail" subName="Events" />

      <Row className="g-3">
        {/* Left: cover image + meta */}
        <Col md={4}>
          <Card className="shadow-none border">
            <CardBody className="p-0">
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-100 rounded-top"
                  style={{ height: 240, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="w-100 d-flex align-items-center justify-content-center text-muted rounded-top bg-light"
                  style={{ height: 240 }}
                >
                  <IconifyIcon icon="bx:image" width={48} height={48} />
                </div>
              )}
              <div className="p-3">
                <Badge bg="primary" className="mb-2">ID: {event.id}</Badge>
                <p className="mb-1 text-muted fs-13">
                  <IconifyIcon icon="bx:calendar" className="me-1" />{dateLabel}
                </p>
                <p className="mb-1 text-muted fs-13">
                  <IconifyIcon icon="bx:link" className="me-1" />/{event.slug}
                </p>
                <p className="mb-0 text-muted fs-13">
                  <IconifyIcon icon="bx:images" className="me-1" />
                  {event.images?.length ?? 0} gallery photo{event.images?.length !== 1 ? 's' : ''}
                </p>
              </div>
            </CardBody>
            <div className="border-top p-3 d-flex gap-2 flex-wrap">
              <Link to={`/events/${eventId}/edit`} className="btn btn-primary flex-fill">
                <IconifyIcon icon="bx:edit" className="me-1" />Edit
              </Link>
              <Link to="/events" className="btn btn-outline-secondary flex-fill">
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
              <h5 className="fw-semibold mb-3">{event.title}</h5>
              <Row>
                <Col md={6}><Field label="Event ID" value={event.id} /></Col>
                <Col md={6}><Field label="Date" value={dateLabel} /></Col>
                <Col md={12}><Field label="Slug" value={`/${event.slug}`} /></Col>
              </Row>
            </CardBody>
          </Card>

          {/* Gallery */}
          {event.images?.length > 0 && (
            <Card className="shadow-none border">
              <CardBody>
                <h6 className="fw-semibold mb-3">
                  <IconifyIcon icon="bx:images" className="me-1" />
                  Gallery ({event.images.length})
                </h6>
                <Row className="g-2">
                  {event.images.map((url, idx) => (
                    <Col xs={6} sm={4} md={3} key={idx}>
                      <div className="border rounded overflow-hidden" style={{ height: 110 }}>
                        <img
                          src={url}
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

export default EventDetail;
