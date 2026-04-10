import { useEffect, useMemo, useState } from 'react';
import { Badge, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useEventStore from '@/store/eventStore';

const EventCard = ({ event }) => {
  const dateLabel = event.date
    ? new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <Col xs={12} sm={6} md={4} xl={3}>
      <Card className="h-100 shadow-none border">
        {/* Cover Image */}
        <div style={{ height: 170, overflow: 'hidden', background: '#f8f9fa' }} className="rounded-top">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
              <IconifyIcon icon="bx:image" width={40} height={40} />
            </div>
          )}
        </div>

        <CardBody className="p-2">
          <p
            className="mb-1 fw-semibold fs-13 lh-sm"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {event.title}
          </p>
          <p className="mb-1 text-muted fs-12 text-truncate">/{event.slug}</p>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <Badge bg="secondary" className="fw-normal">
              <IconifyIcon icon="bx:calendar" className="me-1" />
              {dateLabel}
            </Badge>
            {event.images?.length > 0 && (
              <Badge bg="light" text="dark" className="fw-normal border">
                <IconifyIcon icon="bx:images" className="me-1" />
                {event.images.length} photo{event.images.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardBody>

        <div className="border-top p-2 d-flex gap-1">
          <Link
            to={`/events/${event._id}`}
            className="btn btn-sm btn-soft-info flex-fill py-1"
            title="View"
          >
            <IconifyIcon icon="bx:show" />
          </Link>
          <Link
            to={`/events/${event._id}/edit`}
            className="btn btn-sm btn-soft-secondary flex-fill py-1"
            title="Edit"
          >
            <IconifyIcon icon="bx:edit" />
          </Link>
        </div>
      </Card>
    </Col>
  );
};

const Events = () => {
  const { events, loading, fetchEvents } = useEventStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filtered = useMemo(() => {
    if (!search.trim()) return events;
    const q = search.toLowerCase();
    return events.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.slug?.toLowerCase().includes(q)
    );
  }, [events, search]);

  // Sort by date descending
  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [filtered]
  );

  return (
    <>
      <PageMetaData title="Events" />
      <PageBreadcrumb title="Events" subName="Website Utilities" />

      <Card className="mb-3">
        <CardBody>
          <div className="d-flex flex-wrap justify-content-between gap-3">
            <div className="search-bar">
              <span><IconifyIcon icon="bx:search-alt" className="mb-1" /></span>
              <input
                type="search"
                className="form-control"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link to="/events/create" className="btn btn-primary d-flex align-items-center">
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Event
            </Link>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" size="sm" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center text-muted py-5">No events found</div>
      ) : (
        <Row className="g-3">
          {sorted.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </Row>
      )}
    </>
  );
};

export default Events;
