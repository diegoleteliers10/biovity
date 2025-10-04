import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

export const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}