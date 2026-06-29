import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import AuthField from './AuthField';

const validationSchema = Yup.object({
  name: Yup.string().min(2, 'Enter your full name').required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export default function RegistrationForm() {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        localStorage.setItem('user', JSON.stringify({ name: values.name, email: values.email }));
        setSubmitting(false);
        navigate('/');
      }}
    >
      {({ isSubmitting }) => (
        <Form className="auth-form">
          <Field name="name" label="Full name" icon="bi-person" placeholder="Your name" component={AuthField} />
          <Field name="email" type="email" label="Email address" icon="bi-envelope" placeholder="you@example.com" component={AuthField} />
          <Field name="password" type="password" label="Password" icon="bi-lock" placeholder="Create a password" component={AuthField} />
          <Field name="confirmPassword" type="password" label="Confirm password" icon="bi-shield-lock" placeholder="Repeat your password" component={AuthField} />
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
          <p className="auth-switch">Already a member? <Link to="/login">Sign in</Link></p>
        </Form>
      )}
    </Formik>
  );
}
