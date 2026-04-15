import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import { apiFetch } from '@/helpers/httpClient';

const ACCESS_TYPES = ['admin', 'superadmin', 'event', 'showroom', 'website'];

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotificationContext();
  const signUpSchema = yup.object({
    name: yup.string().required('Please enter a username'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Please enter a password'),
    accessType: yup.string().oneOf(ACCESS_TYPES).required('Please select an access type'),
  });
  const { control, handleSubmit, reset, register: registerField } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: { accessType: 'event' },
  });
  const onSubmit = handleSubmit(async values => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.success && res.data?.user) {
        showNotification({ message: `User "${res.data.user.name}" created successfully!`, variant: 'success' });
        reset({ name: '', password: '', accessType: 'event' });
      }
    } catch (e) {
      showNotification({ message: e.message ?? 'Failed to create user. Please try again.', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  });
  return <form className="authentication-form" onSubmit={onSubmit}>
      <TextFormInput control={control} name="name" containerClassName="mb-3" label="Username" id="name" placeholder="Enter username" />
      <PasswordFormInput control={control} name="password" containerClassName="mb-3" placeholder="Enter password" id="password-id" label="Password" />
      <div className="mb-3">
        <label className="form-label">Access Type</label>
        <select className="form-select" {...registerField('accessType')}>
          {ACCESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>;
};
export default SignUpForm;