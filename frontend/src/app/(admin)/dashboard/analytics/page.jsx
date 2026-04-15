import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import SummaryCards from './components/SummaryCards';
import LeadSourceChart from './components/LeadSourceChart';
import LeadStatusCharts from './components/LeadStatusCharts';
import RecentLeads from './components/RecentLeads';
import QRCodeStats from './components/QRCodeStats';
import ShowroomLeadsChart from './components/ShowroomLeadsChart';

export default function Analytics() {
  return (
    <>
      <PageBreadcrumb title="Analytics" subName="Dashboards" />
      <PageMetaData title="Analytics" />

      {/* Row 1 — 6 summary stat cards */}
      <SummaryCards />

      {/* Row 2 — Lead source donut + status breakdown */}
      <Row className="g-3 mb-3">
        <Col xl={8}>
          <LeadSourceChart />
        </Col>
        <Col xl={4}>
          <LeadStatusCharts />
        </Col>
      </Row>

      {/* Row 3 — Recent leads table + QR code stats */}
      <Row className="g-3 mb-3">
        <Col xl={7}>
          <RecentLeads />
        </Col>
        <Col xl={5}>
          <QRCodeStats />
        </Col>
      </Row>

      {/* Row 4 — Showroom and event leads by location */}
      <Row className="g-3">
        <Col xl={12}>
          <ShowroomLeadsChart />
        </Col>
      </Row>
    </>
  );
}
