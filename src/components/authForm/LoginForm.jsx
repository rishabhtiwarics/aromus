import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import AuthField from './AuthField';

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function LoginForm() {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        localStorage.setItem('user', JSON.stringify({ email: values.email }));
        setSubmitting(false);
        navigate('/');
      }}
    >
      {({ isSubmitting }) => (
        <Form className="auth-form">
          <Field
            name="email"
            type="email"
            label="Email address"
            icon="bi-envelope"
            placeholder="you@example.com"
            component={AuthField}
          />
          <Field
            name="password"
            type="password"
            label="Password"
            icon="bi-lock"
            placeholder="Enter your password"
            component={AuthField}
          />
          <div className="auth-form-row">
            <label className="auth-remember">
              <Field type="checkbox" name="remember" />
              Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="auth-switch">New to Aromus? <Link to="/register">Create account</Link></p>
        </Form>
      )}
    </Formik>
  );
}
