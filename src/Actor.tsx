import { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Table,
  Select,
  Space,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { headers, request } from './utils';
import type { ColumnsType } from 'antd/es/table';
import type {
  ActorSearchParams as SearchParams,
  ActorFieldsValue as FieldsValue,
  ActorEditParams as EditParams,
  ActorListItem as ListItem,
} from './utils';
import './App.css';

const { Item } = Form;

export default function Actor() {
  const [list, setList] = useState<ListItem[]>([]);
  const [initList, setInitList] = useState<ListItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<ListItem | null>(null);

  const [searchForm] = Form.useForm<SearchParams>();
  const [form] = Form.useForm<FieldsValue>();

  const isEdit = !!record;

  function filterList(list: ListItem[]) {
    const { name, tag } = searchForm.getFieldsValue();
    let filtered = list;
    if (name)
      filtered = list.filter(item => item.name.includes(name));
    if (tag)
      filtered = list.filter(item => item.tags?.includes(tag));
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
    const { tags, ...rest } = record;
    form.setFieldsValue({
      ...rest,
      tags: tags ? tags.split(',') : undefined,
    });
  }

  async function handleDelete(id: number) {
    const res = await request(`/node/actor/${id}`, {
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
    const url = `/node/actor${isEdit ? `/${record.id}` : ''}`;
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
      const { tags, ...rest } = values;
      postOrPut({
        ...rest,
        tags: tags ? tags.join(',') : undefined,
      });
    });
  }

  async function fetchList() {
    const res = await request('/node/actor-list');
    if (!res) return;

    const { code, data, message: msg } = res;
    if (code === 200 && data) {
      setInitList(data);
      setList(filterList(data));
    } else message.error(msg); 
  }

  const columns: ColumnsType<ListItem> = [
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '名字二',
      dataIndex: 'name1',
    },
    {
      title: '名字三',
      dataIndex: 'name2',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '标签',
      dataIndex: 'tags',
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
            <Item label="名字" name="name">
              <Input allowClear placeholder="请输入名字" />
            </Item>
          </Col>
          <Col span={8}>
            <Item label="标签" name="tag">
              <Select
                allowClear
                showSearch
                placeholder="请选择标签"
                options={[]}
              />
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
            label="名字"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入名字" />
          </Item>
          <Item
            label="名字二"
            name="name1"
          >
            <Input placeholder="请输入名字二" />
          </Item>
          <Item
            label="名字三"
            name="name2"
          >
            <Input placeholder="请输入名字三" />
          </Item>
          <Item
            label="年龄"
            name="age"
          >
            <InputNumber style={{ width: '100%' }} min={14} />
          </Item>
          <Item
            label="标签"
            name="tags"
          >
            <Select
              allowClear
              showSearch
              placeholder="请选择标签"
              options={[]}
            />
          </Item>
          <Item
            label="描述"
            name="desc"
          >
            <Input placeholder="请输入描述" />
          </Item>
        </Form>
      </Modal>
    </div>
  );
}