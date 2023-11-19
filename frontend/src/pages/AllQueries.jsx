import Cookies from 'universal-cookie';
import { Button } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderContainer from '../components/Header';
import QueriesTable from '../components/QueriesTable';
import '../styles/AllQueries.css'


const AllQueries = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cookies = new Cookies()

  useEffect(() => {
    const token = cookies.get('jwt_authorization');
    if (token) {
      setIsLoggedIn(true)
    }
  }, [cookies]);

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <>
      <HeaderContainer />
      {isLoggedIn ? (
          <div className="allqueries-container">
            <h2>Select a query to visualize it or comment it</h2>
            <QueriesTable />
          </div>
        ) : (
          <div className="allqueries-container">
            <h2>Please log in to access to the QueryBuilder App</h2>
            <Button type="primary" onClick={handleLogin} className="query-builder-button">
              Log In
            </Button>
          </div>
        )}
    </>
  );
}
export default AllQueries;