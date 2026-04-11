import { useEffect, useMemo, useState } from 'react';
import { Badge, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useShowroomStore from '@/store/showroomStore';

const imageSrc = (value) => {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://skydecor.in/${value}`;
};

const ShowroomCard = ({ showroom, onDelete, deleting }) => {
  const dateLabel = showroom.date
    ? new Date(showroom.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <Col xs={12} sm={6} md={4} xl={3}>
      <Card className="h-100 shadow-none border">
        <div style={{ height: 170, overflow: 'hidden', background: '#f8f9fa' }} className="rounded-top">
          {showroom.coverImage ? (
            <img
              src={imageSrc(showroom.coverImage)}
              alt={showroom.title}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
              <IconifyIcon icon="bx:store" width={40} height={40} />
            </div>
          )}
        </div>

        <CardBody className="p-2">
          <p
            className="mb-1 fw-semibold fs-13 lh-sm"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {showroom.title}
          </p>
          <p className="mb-1 text-muted fs-12 text-truncate">
            <IconifyIcon icon="bx:map-pin" className="me-1" />{showroom.location}
          </p>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <Badge bg="secondary" className="fw-normal">
              <IconifyIcon icon="bx:calendar" className="me-1" />
              {dateLabel}
            </Badge>
            {showroom.images?.length > 0 && (
              <Badge bg="light" text="dark" className="fw-normal border">
                <IconifyIcon icon="bx:images" className="me-1" />
                {showroom.images.length} photo{showroom.images.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardBody>

        <div className="border-top p-2 d-flex gap-1">
          <Link
            to={`/showrooms/${showroom._id}`}
            className="btn btn-sm btn-soft-info flex-fill py-1"
            title="View"
          >
            <IconifyIcon icon="bx:show" />
          </Link>
          <Link
            to={`/showrooms/${showroom._id}/edit`}
            className="btn btn-sm btn-soft-secondary flex-fill py-1"
            title="Edit"
          >
            <IconifyIcon icon="bx:edit" />
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-soft-danger flex-fill py-1"
            title="Delete"
            onClick={() => onDelete(showroom)}
            disabled={deleting}
          >
            {deleting ? <Spinner animation="border" size="sm" /> : <IconifyIcon icon="bx:trash" />}
          </button>
        </div>
      </Card>
    </Col>
  );
};

const Showrooms = () => {
  const { showrooms, loading, fetchShowrooms, deleteShowroom } = useShowroomStore();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchShowrooms();
  }, [fetchShowrooms]);

  const filtered = useMemo(() => {
    if (!search.trim()) return showrooms;
    const q = search.toLowerCase();
    return showrooms.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q) ||
        s.location?.toLowerCase().includes(q)
    );
  }, [showrooms, search]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [filtered]
  );

  const handleDelete = async (showroom) => {
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

    setDeletingId(showroom._id);
    const ok = await deleteShowroom(showroom._id);
    setDeletingId(null);

    if (ok) {
      await Swal.fire({
        title: 'Deleted',
        text: 'The showroom was deleted successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <>
      <PageMetaData title="Showrooms" />
      <PageBreadcrumb title="Showrooms" subName="Website Utilities" />

      <Card className="mb-3">
        <CardBody>
          <div className="d-flex flex-wrap justify-content-between gap-3">
            <div className="search-bar">
              <span><IconifyIcon icon="bx:search-alt" className="mb-1" /></span>
              <input
                type="search"
                className="form-control"
                placeholder="Search showrooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link to="/showrooms/create" className="btn btn-primary d-flex align-items-center">
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Showroom
            </Link>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" size="sm" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center text-muted py-5">No showrooms found</div>
      ) : (
        <Row className="g-3">
          {sorted.map((showroom) => (
            <ShowroomCard
              key={showroom._id}
              showroom={showroom}
              onDelete={handleDelete}
              deleting={deletingId === showroom._id}
            />
          ))}
        </Row>
      )}
    </>
  );
};

export default Showrooms;
