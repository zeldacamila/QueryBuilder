import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { jwtDecode } from "jwt-decode";
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

function QueryBuilder() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get('jwt_authorization');
    if (token) {
      setIsLoggedIn(true);
      const decoded = jwtDecode(token);
      setUserName(decoded.sub);
    }
  }, []);

  
  const handleLogout = () => {
    cookies.remove('jwt_authorization', { path: '/' });
    setIsLoggedIn(false);
    setUserName('');
  };

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <>
      <div className="query-builder-container">
        {isLoggedIn ? (
          <>
            <h1>Create your query and visualize it</h1>
            <p>Welcome, {userName}</p> 
            <Button type="primary" htmlType="submit" className="query-builder-button">
              Run query
            </Button>
            <Button type="default" onClick={handleLogout} className="query-builder-button">
              Logout
            </Button>
          </>
        ) : (
            <>
              <h1>Please log in to access to the Query Builder</h1>
              <Button type="primary" onClick={handleLogin} className="query-builder-button">
                Log in
              </Button>
            </>
        )}
      </div>
    </>
  )
}

export default QueryBuilder