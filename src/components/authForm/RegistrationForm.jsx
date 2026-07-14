import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import AuthField from './AuthField';
import { api } from '../../api/client';

const validationSchema = Yup.object({
  name: Yup.string().min(2, 'Enter your full name').required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().min(10, 'Enter a valid phone number').required('Phone is required'),
  password: Yup.string().min(8, 'Minimum 8 characters').matches(/[A-Z]/, 'Include an uppercase letter').matches(/[0-9]/, 'Include a number').matches(/[^A-Za-z0-9]/, 'Include a special character').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export default function RegistrationForm() {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ name: '', email: '', phone: '', password: '', confirmPassword: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        const [firstName, ...lastName] = values.name.trim().split(/\s+/);
        try {
          await api.post('/user/register', { firstName, lastName: lastName.join(' '), email: values.email, phone: values.phone, password: values.password, confirmPassword: values.confirmPassword });
          const response = await api.post('/user/login', { email: values.email, password: values.password });
          localStorage.setItem('aromus-token', response.token);
          localStorage.setItem('user', JSON.stringify(response.data));
          navigate('/');
        } catch (error) { setStatus(error.message); }
        finally { setSubmitting(false); }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className="auth-form">
          <Field name="name" label="Full name" icon="bi-person" placeholder="Your name" component={AuthField} />
          <Field name="email" type="email" label="Email address" icon="bi-envelope" placeholder="you@example.com" component={AuthField} />
          <Field name="phone" type="tel" label="Phone number" icon="bi-telephone" placeholder="9876543210" component={AuthField} />
          <Field name="password" type="password" label="Password" icon="bi-lock" placeholder="Create a password" component={AuthField} />
          <Field name="confirmPassword" type="password" label="Confirm password" icon="bi-shield-lock" placeholder="Repeat your password" component={AuthField} />
          {status && <p className="shop-error">{status}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
          <p className="auth-switch">Already a member? <Link to="/login">Sign in</Link></p>
        </Form>
      )}
    </Formik>
  );
}
