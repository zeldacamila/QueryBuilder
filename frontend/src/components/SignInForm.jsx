import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import { jwtDecode } from "jwt-decode";
import Cookies from 'universal-cookie';
import api from '../api';

const SignInForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const cookies = new Cookies();
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const onFinish = async (values) => {
    try {
      const response = await api.post('/users', {
        user_name: values.username,
      });
      const token = response.data.access_token
      const decodedToken = jwtDecode(token);
      cookies.set("jwt_authorization", token, {
        expires: new Date(decodedToken.exp * 1000),
      })
      navigate('/querybuilder')
    } catch (error) {
      const message = error.response?.data?.detail || 'An unknown error occurred';
      setErrorMessage(message);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Sign in
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Error"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={[<Button key="back" onClick={handleModalClose}>Close</Button>]}
      >
        <p>{errorMessage}</p>
      </Modal>
    </>
  );
};
export default SignInForm;