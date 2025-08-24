import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const OnboardingLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
export default OnboardingLayout;