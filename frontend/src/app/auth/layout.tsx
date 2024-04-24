import { WelcomeImage } from '@/assets/auth/WelcomeImage';
import styles from '@/styles/pages/auth/Auth.module.css';

const AuthPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.authPagesContainer}>
      <WelcomeImage />
      <section className={styles.authRightSubcontainer}>{children}</section>
    </div>
  );
};

export default AuthPageLayout;
