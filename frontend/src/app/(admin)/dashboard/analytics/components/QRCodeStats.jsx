import { useEffect } from 'react';
import { Badge, Card, CardBody, ProgressBar, Spinner } from 'react-bootstrap';
import useQrCodeStore from '@/store/qrCodeStore';

const QRCodeStats = () => {
  const { qrCodes, loading, fetchQrCodes } = useQrCodeStore();

  useEffect(() => { fetchQrCodes(); }, []);

  const sorted    = [...qrCodes].sort((a, b) => (b.scanCount || 0) - (a.scanCount || 0));
  const topCodes  = sorted.slice(0, 10);
  const maxScans  = topCodes[0]?.scanCount || 1;
  const totalScans = qrCodes.reduce((s, q) => s + (q.scanCount || 0), 0);
  const active    = qrCodes.filter(q => q.status === 'active').length;

  return (
    <Card className="h-100">
      <CardBody>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-0">QR Code Scans</h5>
            <p className="text-muted fs-13 mb-0">Top scanned product codes</p>
          </div>
          <div className="text-end">
            <div className="fw-bold fs-16">{totalScans.toLocaleString()}</div>
            <div className="text-muted fs-11">total scans</div>
          </div>
        </div>

        <div className="d-flex gap-3 mb-3">
          <div className="text-center">
            <div className="fw-semibold fs-15">{qrCodes.length}</div>
            <div className="text-muted fs-11">Total QRs</div>
          </div>
          <div className="text-center">
            <div className="fw-semibold fs-15 text-success">{active}</div>
            <div className="text-muted fs-11">Active</div>
          </div>
          <div className="text-center">
            <div className="fw-semibold fs-15 text-danger">{qrCodes.length - active}</div>
            <div className="text-muted fs-11">Inactive</div>
          </div>
        </div>

        {loading && qrCodes.length === 0 ? (
          <div className="d-flex justify-content-center py-4"><Spinner /></div>
        ) : topCodes.length === 0 ? (
          <p className="text-muted fs-13">No QR codes found</p>
        ) : (
          <div>
            {topCodes.map((qr) => (
              <div key={qr._id || qr.productCode} className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div>
                    <span className="fw-medium fs-13">{qr.productCode}</span>
                    <span className="text-muted fs-12 ms-2 text-truncate d-inline-block" style={{ maxWidth: 100 }}>
                      {qr.productName}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold fs-13">{(qr.scanCount || 0).toLocaleString()}</span>
                    <Badge
                      bg={qr.status === 'active' ? 'success' : qr.status === 'expired' ? 'danger' : 'secondary'}
                      className="fw-normal fs-10"
                    >
                      {qr.status}
                    </Badge>
                  </div>
                </div>
                <ProgressBar
                  now={maxScans > 0 ? Math.round(((qr.scanCount || 0) / maxScans) * 100) : 0}
                  variant="primary"
                  style={{ height: 5 }}
                />
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default QRCodeStats;
