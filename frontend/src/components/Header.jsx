import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { jwtDecode } from "jwt-decode";
import Cookies from 'universal-cookie';
import '../styles/Header.css'

const HeaderContainer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get('jwt_authorization');
    if (token) {
      setIsLoggedIn(true);
      const decoded = jwtDecode(token);
      setUserName(decoded.sub);
    }
  }, [cookies]);
  
  const handleBackHome = () => {
      navigate(-1)
    };
  const handleLogout = () => {
    cookies.remove('jwt_authorization', { path: '/' });
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  return (
    <div className="header-container">
      {isLoggedIn && (
        <>
          <div>
            <Button type="primary" className="back-button" onClick={handleBackHome}>Back</Button>
          </div>
          <div className='welcome-logout-container'>
            <h3>Welcome, {userName}</h3>
            <Button type="primary" danger onClick={handleLogout} className="logout-button">
              Log Out
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderContainer;
