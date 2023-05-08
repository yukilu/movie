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
  Tag as AntdTag,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { colors, headers, request, tagTypeMap, tagTypes } from './utils';
import type { ColumnsType } from 'antd/es/table';
import type {
  TagSearchParams as SearchParams,
  TagFieldsValue as FieldsValue,
  TagEditParams as EditParams,
  TagListItem as ListItem,
} from './utils';
import './App.css';

const { Item } = Form;

export default function Tag() {
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
    const res = await request(`/node/tag/${id}`, {
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
    const url = `/node/tag${isEdit ? `/${record.id}` : ''}`;
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
    const res = await request('/node/tag-list');
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
      render: (n: string, record) => <AntdTag color={record.color}>{n}</AntdTag>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (t: string) => tagTypeMap[t],
    },
    {
      title: '颜色',
      dataIndex: 'color',
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
              <Select allowClear placeholder="请选择类型" options={tagTypes} />
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
            label="类型"
            name="type"
            rules={[{ required: true }]}
          >
            <Select placeholder="请选择类型" options={tagTypes} />
          </Item>
          <Item
            label="颜色"
            name="color"
            rules={[{ required: true }]}
          >
            <Select
              allowClear
              showSearch
              placeholder="请选择颜色"
              options={colors}
            />
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