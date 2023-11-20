import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css'

const NotFound = () => {
  const navigate = useNavigate()
  const handleBackHome = () => {
    navigate(-1)
  };

  return (
    <Result
      className="notfound-page"
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={handleBackHome}>Back</Button>}
    />
  );
}
export default NotFound;