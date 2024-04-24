'use server';
import LoginForm from '@/components/organisms/forms/LoginForm';

export const LoginPage = async (): Promise<React.ReactElement> => {
  return <LoginForm />;
};

export default LoginPage;
