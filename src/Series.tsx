import { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Table,
  Select,
  Space,
  Tag,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { headers, request, seriesTypeMap, seriesTypes } from './utils';
import type { ColumnsType } from 'antd/es/table';
import type {
  SeriesSearchParams as SearchParams,
  SeriesFieldsValue as FieldsValue,
  SeriesEditParams as EditParams,
  SeriesListItem as ListItem,
} from './utils';
import './App.css';

const { Item } = Form;

export default function Series() {
  const [list, setList] = useState<ListItem[]>([]);
  const [initList, setInitList] = useState<ListItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<ListItem | null>(null);

  const [searchForm] = Form.useForm<SearchParams>();
  const [form] = Form.useForm<FieldsValue>();

  const isEdit = !!record;

  function filterList(list: ListItem[]) {
    const { name, type } = searchForm.getFieldsValue();
    let filtered = list;
    if (name)
      filtered = list.filter(item => item.name.includes(name));
    if (type)
      filtered = list.filter(item => item.type === type);
    return filtered;
  }

  function handleSearch() {
    const filtered = filterList(initList);
    setList(filtered);
  }

  function handleReset() {
    searchForm.resetFields();
    setList(initList);
  }

  function handleAdd() {
    setVisible(true);
  }

  function handleEdit(record: ListItem) {
    setVisible(true);
    setRecord(record);
    form.setFieldsValue(record);
  }

  async function handleDelete(id: number) {
    const res = await request(`/node/series/${id}`, {
      method: 'DELETE',
    });
    if (!res) return;

    const { code, message: msg } = res;
    if (code === 200) {
      message.success(msg);
      fetchList();
    } else message.error(msg);
  }

  function handleCancel() {
    setVisible(false);
    setRecord(null);
    form.resetFields();
  }

  async function postOrPut(payload: EditParams) {
    const url = `/node/series${isEdit ? `/${record.id}` : ''}`;
    const res = await request(url, {
      headers,
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });
    if (!res) return;

    const { code, message: msg } = res;
    if (code === 200) {
      handleCancel();
      message.success(msg);
      fetchList();
    } else message.error(msg);
  }

  function handleSubmit() {
    form.validateFields().then(values => {
      postOrPut(values);
    });
  }

  async function fetchList() {
    const res = await request('/node/series-list');
    if (!res) return;

    const { code, data, message: msg } = res;
    if (code === 200 && data) {
      setInitList(data);
      setList(filterList(data));
    } else message.error(msg); 
  }

  const columns: ColumnsType<ListItem> = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '全称',
      dataIndex: 'full',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (t: string) => <Tag color={t === '无码' ? 'blue' : 'magenta'}>{seriesTypeMap[t]}</Tag>,
    },
    {
      title: '出版商',
      dataIndex: 'publisher',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (txt: number, record) => (
        <Space size="large">
          <EditOutlined className="App-icon" onClick={() => handleEdit(record)} />
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(txt)}>
            <DeleteOutlined className="App-delete" />
          </Popconfirm>
        </Space>
      ),
    }
  ];

  useEffect(() => {
    fetchList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App-container">
      <Form form={searchForm}>
        <Row gutter={24}>
          <Col span={8}>
            <Item label="名称" name="name">
              <Input allowClear placeholder="请输入名称" />
            </Item>
          </Col>
          <Col span={8}>
            <Item label="类型" name="type">
              <Select allowClear placeholder="请选择类型" options={seriesTypes} />
            </Item>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} />
              <Button icon={<ReloadOutlined />} onClick={handleReset} />
              <Button icon={<PlusOutlined />} onClick={handleAdd} />
            </Space>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="id"
        dataSource={list}
        columns={columns}
        pagination={{
          total: list?.length,
          showTotal: (total: number) => `共${total}条`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
      <Modal
        open={visible}
        title={`${isEdit ? '编辑' : '新增'}`}
        onCancel={handleCancel}
        onOk={handleSubmit}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          validateMessages={{ required: '${label}不能为空' }}
        >
          <Item
            label="名称"
            name="name"
            rules={[{ required: true }]}
          >
            <Input allowClear placeholder="请输入名称" />
          </Item>
          <Item
            label="全称"
            name="full"
          >
            <Input placeholder="请输入全称" />
          </Item>
          <Item
            label="类型"
            name="type"
            rules={[{ required: true }]}
          >
            <Select placeholder="请选择类型" options={seriesTypes} />
          </Item>
          <Item
            label="出版商"
            name="publisher"
          >
            <Input allowClear placeholder="请输入出版商" />
          </Item>
          <Item
            label="描述"
            name="desc"
          >
            <Input allowClear placeholder="请输入描述" />
          </Item>
        </Form>
      </Modal>
    </div>
  );
}