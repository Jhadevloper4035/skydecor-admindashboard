import { useEffect } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import SelectFormInput from '@/components/form/SelectFormInput';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const employmentTypeOptions = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Remote', label: 'Remote' },
];

const experienceOptions = [
  { value: 'Fresher', label: 'Fresher' },
  { value: '0-1 years', label: '0-1 years' },
  { value: '1-3 years', label: '1-3 years' },
  { value: '3-5 years', label: '3-5 years' },
  { value: '5-10 years', label: '5-10 years' },
  { value: '10+ years', label: '10+ years' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const formatDateInput = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().split('T')[0];
};

const linesToArray = (value) =>
  String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const arrayToLines = (value) => (Array.isArray(value) ? value.join('\n') : '');

const getDefaults = (job = {}) => ({
  title: job.title ?? '',
  slug: job.slug ?? '',
  department: job.department ?? '',
  location: job.location ?? '',
  employmentType: job.employmentType ?? 'Full-time',
  experience: job.experience ?? 'Fresher',
  qualification: job.qualification ?? '',
  description: job.description ?? '',
  responsibilities: arrayToLines(job.responsibilities),
  requirements: arrayToLines(job.requirements),
  openings: job.openings ?? 1,
  salaryRange: job.salaryRange ?? '',
  status: job.status ?? 'active',
  postedAt: formatDateInput(job.postedAt) || formatDateInput(new Date()),
  expiresAt: formatDateInput(job.expiresAt),
});

const JobForm = ({ initialValues, onSubmit, submitting, submitLabel }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: getDefaults(initialValues),
  });

  useEffect(() => {
    reset(getDefaults(initialValues));
  }, [initialValues, reset]);

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      openings: Number(values.openings) || 1,
      responsibilities: linesToArray(values.responsibilities),
      requirements: linesToArray(values.requirements),
      expiresAt: values.expiresAt || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Row>
        <Col md={6}>
          <TextFormInput
            control={control}
            name="title"
            label="Job Title"
            placeholder="e.g. Sales Executive"
            containerClassName="mb-3"
          />
        </Col>
        <Col md={6}>
          <TextFormInput
            control={control}
            name="slug"
            label="Slug"
            placeholder="Auto-generated if empty"
            containerClassName="mb-3"
          />
        </Col>
        <Col md={4}>
          <TextFormInput
            control={control}
            name="department"
            label="Department"
            placeholder="e.g. Sales"
            containerClassName="mb-3"
          />
        </Col>
        <Col md={4}>
          <TextFormInput
            control={control}
            name="location"
            label="Location"
            placeholder="e.g. Delhi"
            containerClassName="mb-3"
          />
        </Col>
        <Col md={4}>
          <SelectFormInput
            control={control}
            name="employmentType"
            label="Employment Type"
            options={employmentTypeOptions}
            containerClassName="mb-3"
          />
        </Col>
        <Col md={4}>
          <SelectFormInput
            control={control}
            name="experience"
            label="Experience"
            options={experienceOptions}
            containerClassName="mb-3"
          />
        </Col>
        <Col md={4}>
          <TextFormInput
            control={control}
            name="qualification"
            label="Qualification"
            placeholder="e.g. Graduate"
            containerClassName="mb-3"
          />
        </Col>
        <Col md={4}>
          <TextFormInput
            control={control}
            name="openings"
            label="Openings"
            type="number"
            min="1"
            containerClassName="mb-3"
          />
        </Col>
        <Col md={4}>
          <TextFormInput
            control={control}
            name="salaryRange"
            label="Salary Range"
            placeholder="e.g. 3-5 LPA"
            containerClassName="mb-3"
          />
        </Col>
        <Col md={4}>
          <TextFormInput
            control={control}
            name="postedAt"
            label="Posted On"
            type="date"
            containerClassName="mb-3"
          />
        </Col>
        <Col md={4}>
          <TextFormInput
            control={control}
            name="expiresAt"
            label="Expires On"
            type="date"
            containerClassName="mb-3"
          />
        </Col>
        <Col md={4}>
          <SelectFormInput
            control={control}
            name="status"
            label="Status"
            options={statusOptions}
            containerClassName="mb-3"
          />
        </Col>
        <Col md={12}>
          <TextAreaFormInput
            control={control}
            name="description"
            label="Description"
            rows={5}
            placeholder="Describe the job role"
            containerClassName="mb-3"
          />
        </Col>
        <Col md={6}>
          <TextAreaFormInput
            control={control}
            name="responsibilities"
            label="Responsibilities"
            rows={6}
            placeholder="Add one responsibility per line"
            containerClassName="mb-3"
          />
        </Col>
        <Col md={6}>
          <TextAreaFormInput
            control={control}
            name="requirements"
            label="Requirements"
            rows={6}
            placeholder="Add one requirement per line"
            containerClassName="mb-3"
          />
        </Col>
      </Row>

      <div className="d-flex gap-2 mt-2">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? <Spinner animation="border" size="sm" className="me-1" /> : <IconifyIcon icon="bx:check" className="me-1" />}
          {submitLabel}
        </Button>
        <Link to="/jobs" className="btn btn-outline-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
};

export default JobForm;
