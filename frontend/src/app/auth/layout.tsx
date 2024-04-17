import styles from '@/styles/Auth.module.css';
import { WelcomeImage } from '@/assets/auth/WelcomeImage';

const AuthPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.authPagesContainer}>
      <WelcomeImage />
      <section className={styles.authRightSubcontainer}>{children}</section>
    </div>
  );
};

export default AuthPageLayout;
