import RegistrationForm from '../../authForm/RegistrationForm';
import AuthPageLayout from './AuthPageLayout';

export default function RegisterPage() {
  return (
    <AuthPageLayout
      eyebrow="Join Aromus"
      title="Create your account"
      description="Save favourites, discover recommendations, and enjoy a more personal fragrance journey."
    >
      <RegistrationForm />
    </AuthPageLayout>
  );
}
