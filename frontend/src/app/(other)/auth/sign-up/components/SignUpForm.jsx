import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import { apiFetch } from '@/helpers/httpClient';
import AccessPermissionSelector from '@/components/AccessPermissionSelector';
import { ACCESS_TYPES } from '@/constants/access';
import { useAuthContext } from '@/context/useAuthContext';

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const { user } = useAuthContext();
  const { showNotification } = useNotificationContext();
  const accessTypeOptions = user?.accessType === 'superadmin'
    ? ACCESS_TYPES
    : ACCESS_TYPES.filter((type) => !['admin', 'superadmin'].includes(type));
  const signUpSchema = yup.object({
    name: yup.string().required('Please enter a username'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Please enter a password'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm the password'),
    accessType: yup.string().oneOf(accessTypeOptions).required('Please select an access type'),
  });
  const { control, handleSubmit, reset, register: registerField, formState: { errors } } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: { accessType: 'custom', confirmPassword: '' },
  });
  const onSubmit = handleSubmit(async values => {
    setLoading(true);
    const { confirmPassword, ...payload } = values;
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, permissions }),
      });
      if (res.success && res.data?.user) {
        showNotification({ message: `User "${res.data.user.name}" created successfully!`, variant: 'success' });
        reset({ name: '', password: '', confirmPassword: '', accessType: 'custom' });
        setPermissions([]);
      }
    } catch (e) {
      showNotification({ message: e.message ?? 'Failed to create user. Please try again.', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  });
  return <form className="authentication-form" onSubmit={onSubmit}>
      <Row className="g-3 mb-3">
        <Col md={6}>
          <TextFormInput control={control} name="name" containerClassName="mb-0" label="Username" id="name" placeholder="Enter username" />
        </Col>
        <Col md={6}>
          <div className="mb-0">
            <label className="form-label">User Type</label>
            <Form.Select isInvalid={Boolean(errors.accessType)} {...registerField('accessType')}>
              {accessTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </Form.Select>
            {errors.accessType?.message && <div className="invalid-feedback d-block">{errors.accessType.message}</div>}
          </div>
        </Col>
        <Col md={6}>
          <PasswordFormInput control={control} name="password" containerClassName="mb-0" placeholder="Enter password" id="password-id" label="Password" />
        </Col>
        <Col md={6}>
          <PasswordFormInput control={control} name="confirmPassword" containerClassName="mb-0" placeholder="Confirm password" id="confirm-password-id" label="Confirm Password" />
        </Col>
      </Row>
      <div className="mb-3">
        <label className="form-label">Page Access</label>
        <AccessPermissionSelector value={permissions} onChange={setPermissions} disabled={loading} />
      </div>
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>;
};
export default SignUpForm;
