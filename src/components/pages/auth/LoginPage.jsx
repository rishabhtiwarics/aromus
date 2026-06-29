import LoginForm from '../../authForm/LoginForm';
import AuthPageLayout from './AuthPageLayout';

export default function LoginPage() {
  return (
    <AuthPageLayout
      eyebrow="Welcome Back"
      title="Sign in to Aromus"
      description="Return to your collection and continue discovering remarkable scents."
    >
      <LoginForm />
    </AuthPageLayout>
  );
}
