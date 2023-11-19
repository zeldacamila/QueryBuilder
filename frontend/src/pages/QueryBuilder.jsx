import { useState, useEffect } from 'react';
import { Button, Radio } from 'antd';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import HeaderContainer from '../components/Header';
import './QueryBuilder.css'

function QueryBuilder() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cookies = new Cookies();
  
  useEffect(() => {
    const token = cookies.get('jwt_authorization');
    if (token) {
      setIsLoggedIn(true)
    }
  }, [cookies]);

  const handleLogin = () => {
    navigate('/');
  };

  const handleRadioChange = e => {
    setSelectedOption(e.target.value);
  };

  const handleButtonClick = () => {
    if (selectedOption === 'runAndSave') {
      navigate('/querybuilder/run-query');
    } else if (selectedOption === 'showSaved') {
      navigate('/saved-queries');
    }
  };

  return (

    <>
      <HeaderContainer />
      {isLoggedIn ? (
          <div className="query-builder-container">
            <h2>What do you want to do?</h2>
            <Radio.Group onChange={handleRadioChange} value={selectedOption} className="radio-group">
              <Radio value="runAndSave">Run a query and save it.</Radio>
              <Radio value="showSaved">Show all saved queries.</Radio>
            </Radio.Group>
            <Button type="primary" onClick={handleButtonClick}>
              Go
            </Button>
          </div>
        ) : (
          <div className="query-builder-container">
            <h2>Please log in to access to the QueryBuilder App</h2>
            <Button type="primary" onClick={handleLogin}>
              Log In
            </Button>
          </div>
        )}
      </>
  )
}

export default QueryBuilder