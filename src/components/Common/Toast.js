import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export { toast };

export const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={1250}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      theme="colored"
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
    />
  );
};