import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = Cookies.get('accessToken'); // Replace 'accessToken' with your cookie name

  return isLoggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
