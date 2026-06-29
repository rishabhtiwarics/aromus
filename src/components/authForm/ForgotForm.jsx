import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import AuthField from './AuthField';

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

export default function ForgotForm() {
  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={validationSchema}
      onSubmit={(_, { setSubmitting, setStatus }) => {
        setStatus('Reset instructions have been sent to your email.');
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className="auth-form">
          <Field name="email" type="email" label="Email address" icon="bi-envelope" placeholder="you@example.com" component={AuthField} />
          {status && <p className="auth-success">{status}</p>}
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
          <p className="auth-switch"><Link to="/login"><i className="bi bi-arrow-left" /> Back to sign in</Link></p>
        </Form>
      )}
    </Formik>
  );
}
