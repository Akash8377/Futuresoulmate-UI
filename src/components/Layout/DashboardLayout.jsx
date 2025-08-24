import Header from '../Dashboard/Header';
import Footer from '../Footer/Footer';

const DashboardLayout  = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
export default DashboardLayout;