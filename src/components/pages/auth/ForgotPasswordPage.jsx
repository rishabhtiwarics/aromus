import ForgotForm from '../../authForm/ForgotForm';
import AuthPageLayout from './AuthPageLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthPageLayout
      eyebrow="Account Recovery"
      title="Forgot your password?"
      description="Enter your email and we will send instructions to restore access."
    >
      <ForgotForm />
    </AuthPageLayout>
  );
}
