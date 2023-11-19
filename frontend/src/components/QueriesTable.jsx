import { useState, useEffect } from 'react';
import { Table, Space, Button, Collapse } from 'antd';
import api from '../api';

const QueriesTable = () => {
  const [data, setData] = useState([]);
  const { Panel } = Collapse;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/saved_queries');
        const formattedData = response.data.map(item => ({
          ...item,
          key: item.query_id,
          comments: item.comments.map(comment => ({
            owner: comment.owner_name,
            content: comment.comment_content,
          }))
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'Query ID',
      dataIndex: 'query_id',
      key: 'query_id',
    },
    {
      title: 'Query Name',
      dataIndex: 'query_name',
      key: 'query_name',
    },
    {
      title: 'Query Creator',
      dataIndex: 'query_creator',
      key: 'query_creator',
    },
    {
      title: 'Comments',
      key: 'comments',
      dataIndex: 'comments',
      render: comments => (
        <Collapse>
          {comments.map((comment, index) => (
            <Panel header={`${comment.owner}`} key={index}>
              <p>{comment.content}</p>
            </Panel>
          ))}
        </Collapse>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button>Select</Button>
          <Button>Comment</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table columns={columns} dataSource={data} />
  );
};

export default QueriesTable;