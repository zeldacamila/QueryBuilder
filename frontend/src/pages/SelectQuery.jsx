import { useParams, useNavigate } from 'react-router-dom';
import HeaderContainer from '../components/Header';
import Chart from '../components/Chart';
import '../styles/Header.css';
import '../styles/SelectQuery.css';
import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Modal } from 'antd';
import { jwtDecode } from "jwt-decode";
import Cookies from 'universal-cookie';
import api from '../api';

const options = [
  "Enrolment in lower secondary education, (number)",
  "Enrolment in upper secondary education, (number)",
  "Repeaters in primary education, all grades, (number)",
  "Teachers in lower secondary education, (number)",
  "Enrolment in early childhood education, (number)",
  "Net enrolment rate, lower secondary, (%)",
  "Net enrolment rate, upper secondary, (%)",
  "Percentage of enrolment in early childhood education programmes in private institutions (%)",
  "Percentage of enrolment in lower secondary education in private institutions (%)",
  "Percentage of enrolment in upper secondary education in private institutions (%)",
  "Percentage of enrolment in post - secondary non - tertiary education in private institutions(%)",
  "Repeaters in primary education, all grades, (number)",
  "School life expectancy, pre-primary, (years)",
  "School life expectancy, primary, (years)",
  "School life expectancy, post-secondary non-tertiary, (years)",
  "Teachers in lower secondary education, (number)",
  "Teachers in upper secondary education, (number)"
].sort();
const years = [
  '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977',
  '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985',
  '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993',
  '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001',
  '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009',
  '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017',
  '2018', '2019', '2020',
].sort();
const countries = [
  "ALL", "Chad", "Cuba", "Fiji", "Guam", "Iraq", "Mali", "Oman", "Peru", "Togo", "Aruba",
  "Benin", "Chile", "China", "Gabon", "Ghana", "Haiti", "India", "Italy", "Japan",
  "Kenya", "Libya", "Malta", "Bhutan", "Brazil", "Canada", "Cyprus", "France",
  "Greece", "Guinea", "Guyana", "Israel", "Jordan", "Kosovo", "Kuwait", "Latvia",
  "Malawi", "Mexico", "Monaco", "Palau", "Qatar", "Samoa", "Spain", "Sudan",
  "Tonga", "World", "Angola", "Belize"
].sort();

const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18},
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};

const SelectQuery = () => {
  const { queryId } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const formRef = React.useRef(null);
  const cookies = new Cookies();
  const [queryInfo, setQueryInfo] = useState();
  const [queryData, setQueryData] = useState();
  const [queryDetails, setQueryDetails] = useState();
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
 
  useEffect(() => {
    const token = cookies.get('jwt_authorization');
    if (token) {
      setIsLoggedIn(true);
      fetchQueryDetails();
    }
    
  }, []);
  useEffect(() => {
    if (queryDetails && formRef.current) {
      formRef.current.setFieldsValue({
        queryname: queryDetails.query_name,
        country: queryDetails.country_param,
        indicatorName: queryDetails.indicator_param,
        gender: queryDetails.sex_param,
        year: queryDetails.year_param,
      });
    }
  }, [queryDetails]);
  const handleLogin = () => {
    navigate('/');
  };
  const fetchQueryDetails = async () => {
    try {
      const response = await api.get(`/saved_queries/${queryId}`);
      setQueryDetails(response.data);
      console.log(response.data, 'response.data')
    } catch (error) {
      console.error('Error occurred fetching query details:', error);
    }
  };
  const onFinish = async (values) => {
    try {
      const token = cookies.get('jwt_authorization');
      const decodedToken = jwtDecode(token);
      const userName = decodedToken.sub;
      const requestBody = {
        indicator_name: values.indicatorName,
        sex: values.gender,
        year: values.year,
        query_name: values.queryname,
        country_name: values.country,
        user_name: userName
      };
      const response = await api.post('/run_query', requestBody);
      setQueryInfo(requestBody)
      if (response.data.query_results && response.data.query_results.length > 0) {
        const queryResults = response.data.query_results;
        setQueryData(JSON.stringify(queryResults));
        const extractedLabels = queryResults.map(item => item.country_name);
        const extractedValues = queryResults.map(item => item.value);
        setLabels(extractedLabels);
        setValues(extractedValues);
      } else {
        setQueryData('No information registered in the table');
        setLabels([]);
        setValues([]);
      }
    } catch (error) {
      console.error('Error occurred sending the query:', error);
    }
  }
  const onReset = () => {
    if (queryDetails && formRef.current) {
      formRef.current.resetFields();
    }
    formRef.current.resetFields();
    setQueryData(null)
    setQueryInfo(null)
  }
  const handleSaveQuery = async () => {
    try {
      const values = await formRef.current?.validateFields();
      const token = cookies.get('jwt_authorization');
      const decodedToken = jwtDecode(token);
      const userName = decodedToken.sub;
      const requestBody = {
        indicator_name: values.indicatorName,
        sex: values.gender,
        year: values.year,
        query_name: values.queryname,
        country_name: values.country,
        user_name: userName
      };
      const response = await api.post('/save_query', requestBody);
      setSuccessMessage("Query saved successfully!");
      setIsSuccessModalOpen(true);
    } catch (error) {
      const message = error.response?.data?.detail || 'An unknown error occurred while saving the query';
      setErrorMessage(message);
      setIsModalOpen(true);
    }
  }

  return (
    <>
      <HeaderContainer />
      {isLoggedIn ? (
        <div className="builder-container">
          <div className="form-container">
            <h2>Build your query</h2>
            <h3>Please, enter a query name and select the filters to build a SQL query</h3>
            <Form {...layout} ref={formRef} name="control-ref" onFinish={onFinish} style={{ width: 500 }}>
              <Form.Item
                name="queryname"
                label="Query name"
                rules={[{ required: true, message: 'Please input a query name!', }]}
              >
                <Input maxLength={100} />
              </Form.Item>
              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: 'Please select a country name!', }]}
              >
                <Select placeholder="Select a country" allowClear>
                  {countries.map(country => (
                    <Option key={country} value={country}>{country}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="indicatorName"
                label="Indicator"
                rules={[{ required: true, message: 'Please select an indicator' }]}
              >
                <Select placeholder="Select an indicator" allowClear>
                  {options.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select a gender' }]}
              >
                <Select placeholder="Select a option" allowClear>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="both">Both</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="year"
                label="Year"
                rules={[{ required: true, message: 'Please select a year' }]}
              >
                <Select placeholder="Select a year" allowClear>
                  {years.map(year => (
                    <Option key={year} value={year}>{year}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" className='run-button'>
                  Run Query
                </Button>
                <Button type="primary" onClick={handleSaveQuery} className='save-button'>
                  Save Query
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  Reset
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
          </div>
          <div className="graphs-container">
            <h2>Visualize your query</h2>
            <div className="query-info-container">
              {queryInfo && (
                <>
                  <div><strong>Query Name:</strong> {queryInfo.query_name}</div>
                  <div><strong>Query Owner:</strong> {queryInfo.user_name}</div>
                  <div><strong>Indicator:</strong> {queryInfo.indicator_name}</div>
                  <div><strong>Country:</strong> {queryInfo.country_name}</div>
                  <div><strong>Sex:</strong> {queryInfo.sex === 'male' ? 'Male' : queryInfo.sex === 'female' ? 'Female' : 'Both'}</div>
                  <div><strong>Year:</strong> {queryInfo.year}</div>
                </>
              )}
            </div>
            <div className="query-data-container">
              {queryData && (
                <>
                  {queryData === 'No information registered in the table' ? (
                    <div>{queryData}</div>
                  ) : (
                      <div style={{ width: '600px', height: '400px' }}>
                      <Chart labels={labels} values={values} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
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
  );
};

export default SelectQuery;
