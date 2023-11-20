import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Collapse, Form, Input, Modal } from 'antd';
import HeaderContainer from '../components/Header';
import Cookies from 'universal-cookie';
import api from '../api';
import '../styles/CommentQuery.css'
import { jwtDecode } from "jwt-decode";

const CommentQuery = () => {
  const { queryId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [queryDetails, setQueryDetails] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const formRef = React.useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cookies = new Cookies();
  
  useEffect(() => {
    const token = cookies.get('jwt_authorization');
    if (token) {
      setIsLoggedIn(true)
      const decoded = jwtDecode(token);
      setUserName(decoded.sub);
      fetchUserId(decoded.sub);
      fetchQueryDetails();
    }
  }, [isModalOpen, isSuccessModalOpen]);
  const fetchUserId = async (userName) => {
    try {
      const userResponse = await api.post('/get_user_id', { user_name: userName });
      setUserId(userResponse.data.user_id);
    } catch (error) {
      console.error('Error occurred fetching user ID:', error);
    }
  };
  const fetchQueryDetails = async () => {
    try {
      const response = await api.get(`/saved_queries/${queryId}`);
      setQueryDetails(response.data);
    } catch (error) {
      console.error('Error occurred fetching query details:', error);
    }
  };

  const handleLogin = () => {
    navigate('/');
  };

  const { Panel } = Collapse;

  const onFinish = async (values) => {
    try {
      const requestBody = {
        owner_id: userId,
        query_id: parseInt(queryId, 10),
        comment_content: values.comment
      };
      const commentResponse = await api.post('/create_comment/', requestBody);
      setSuccessMessage("Query commented successfully!");
      setIsSuccessModalOpen(true);
      formRef.current?.resetFields();
    } catch (error) {
      const message = error.response?.data?.detail || 'An unknown error occurred';
      setErrorMessage(message);
      setIsModalOpen(true);
      formRef.current?.resetFields();
    }
  };
  return (
    <>
      <HeaderContainer />
      {isLoggedIn ? (
        <div className="comment-query-container">
          <h2>Write a comment to the selected query</h2>
                    <Form
            ref={formRef}
            name="normal_login"
            className="comment-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="comment"
              rules={[
                {
                  required: true,
                  message: 'Please input your comment!',
                },
              ]}
            >
              <Input placeholder="Comment" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="comment-form-button">
                Comment
              </Button>
            </Form.Item>
          </Form>
          <Modal
            title="Error"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[<Button key="back" onClick={() => setIsModalOpen(false)}>Close</Button>]}
          >
            <p>{errorMessage}</p>
          </Modal>
          <Modal
            title="Success"
            open={isSuccessModalOpen}
            onCancel={() => setIsSuccessModalOpen(false)}
            footer={[<Button key="back" onClick={() => setIsSuccessModalOpen(false)}>Close</Button>]}
          >
            <p>{successMessage}</p>
          </Modal>
          {queryDetails ? (
            <Card
              title={`Query Name: ${queryDetails.query_name}`}
              bordered={false}
              style={{ width: 600 }}
            >
              <p><strong>Query Owner: </strong>{queryDetails.query_creator}</p>
              <p><strong>SQL Query: </strong>{queryDetails.sql_query}</p>
              <p><strong>Comments: </strong></p>
              <Collapse>
                {queryDetails.comments.map((comment, index) => (
                  <Panel header={`${comment.owner_name} commented:`} key={index}>
                    <p>{comment.comment_content}</p>
                  </Panel>
                ))}
              </Collapse>
            </Card>
          ) : (
            <p>Loading query details...</p>
          )}

        </div>
        ) : (
          <div className="comment-query-container">
            <h2>Please log in to access to the QueryBuilder App</h2>
            <Button type="primary" onClick={handleLogin}>
              Log In
            </Button>
          </div>
        )}
    </>
  );
};

export default CommentQuery;
