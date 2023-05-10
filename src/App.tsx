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
import {
  headers,
  request,
  diskTypes,
  statusTypes,
  statusTypeMap,
  diskTypeMap,
  getNumMap,
  getTagMap,
  getNames,
  getTags,
  getIdListByIds,
  statusColors,
} from './utils';
import type { ColumnsType } from 'antd/es/table';
import type {
  SearchParams,
  FieldsValue,
  EditParams,
  ListItem,
  TagListItem,
  ActorListItem,
  SeriesListItem,
  TagMap,
  NumMap,
} from './utils';
import './App.css';

const { Item } = Form;

export default function App() {
  const [list, setList] = useState<ListItem[]>([]);
  const [initList, setInitList] = useState<ListItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<ListItem | null>(null);
  const [tagList, setTagList] = useState<TagListItem[]>([]);
  const [tagMap, setTagMap] = useState<TagMap>({})
  const [actorList, setActorList] = useState<ActorListItem[]>([]);
  const [actorMap, setActorMap] = useState<NumMap>({});
  const [seriesList, setSeriesList] = useState<SeriesListItem[]>([]);
  const [seriesMap, setSeriesMap] = useState<NumMap>({});

  const [searchForm] = Form.useForm<SearchParams>();
  const [form] = Form.useForm<FieldsValue>();

  const isEdit = !!record;

  function filterList(list: ListItem[]) {
    const searchValues =  searchForm.getFieldsValue();
    const { name, tag, actor } = searchValues;
    let filtered = list;
    if (name)
      filtered = list.filter(item => item.name.includes(name));
    if (tag)
      filtered = list.filter(item => getIdListByIds(item.tags).includes(tag));
    if (actor)
      filtered = list.filter(item => getIdListByIds(item.actors).includes(actor));
    filtered = (['series', 'idx', 'status', 'disk'] as const).reduce((acc, cur) => {
      const value = searchValues[cur];
      if (value)
        return acc.filter(item => item[cur] === value);
      return acc;
    }, filtered);

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
    const { tags, actors, ...rest } = record;
    form.setFieldsValue({
      ...rest,
      tags: tags ? getIdListByIds(tags) : undefined,
      actors: actors ? getIdListByIds(actors) : undefined,
    });
  }

  async function handleDelete(id: number) {
    const res = await request(`/node/video/${id}`, {
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
    const url = `/node/video${isEdit ? `/${record.id}` : ''}`;
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
      const { tags, actors, ...rest } = values;
      postOrPut({
        ...rest,
        tags: tags ? tags.join(',') : undefined,
        actors: actors ? actors.join(',') : undefined,
      });
    });
  }

  async function fetchList() {
    const res = await request('/node/video-list');
    if (!res) return;

    const { code, data, message: msg } = res;
    if (code === 200 && data) {
      setInitList(data);
      setList(filterList(data));
    } else message.error(msg); 
  }

  async function fetchTagList() {
    const res = await request('/node/tag-list');
    if (!res) return;

    const { code, data } = res;
    if (code === 200 && data) {
      setTagList(data);
      setTagMap(getTagMap(data));
    }
  }

  async function fetchActorList() {
    const res = await request('/node/actor-list');
    if (!res) return;

    const { code, data } = res;
    if (code === 200 && data) {
      setActorList(data);
      setActorMap(getNumMap(data));
    }
  }

  async function fetchSeriesList() {
    const res = await request('/node/series-list');
    if (!res) return;

    const { code, data } = res;
    if (code === 200 && data) {
      setSeriesList(data);
      setSeriesMap(getNumMap(data));
    }
  }


  const columns: ColumnsType<ListItem> = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '系列',
      dataIndex: 'series',
      render: (s: number) => seriesMap[s],
    },
    {
      title: '序号',
      dataIndex: 'idx',
    },
    {
      title: '演员',
      dataIndex: 'actors',
      render: (s: string) => getNames(s, actorMap),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (s: string) => s ? getTags(s, tagMap).map(({ id, name, color }) => <Tag key={id} color={color}>{name}</Tag>) : null,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (s: string) => s ? <Tag color={statusColors[+s]}>{statusTypeMap[s]}</Tag> : null,
    },
    {
      title: '位置',
      dataIndex: 'disk',
      render: (d: string) => diskTypeMap[d],
    },
    {
      title: '创建时间',
      dataIndex: 'date',
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
    fetchTagList();
    fetchActorList();
    fetchSeriesList();
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
            <Item label="系列" name="series">
              <Select
                allowClear
                showSearch
                placeholder="请选择类型"
                optionFilterProp="name"
                options={seriesList}
                fieldNames={{ value: 'id', label: 'name' }}
              />
            </Item>
          </Col>
          <Col span={8}>
            <Item label="演员" name="actor">
              <Select
                allowClear
                showSearch
                placeholder="请选择演员"
                optionFilterProp="name"
                options={actorList}
                fieldNames={{ value: 'id', label: 'name' }}
              />
            </Item>
          </Col>
          <Col span={8}>
            <Item label="标签" name="tag">
              <Select
                allowClear
                showSearch
                placeholder="请选择标签"
                optionFilterProp="name"
                options={tagList}
                fieldNames={{ value: 'id', label: 'name' }}
              />
            </Item>
          </Col>
          {/* <Col span={8}>
            <Item
              label="状态"
              name="status"
            >
              <Select
                allowClear
                placeholder="请选择状态"
                options={statusTypes}
              />
            </Item>
          </Col> */}
          <Col span={8}>
            <Item
              label="位置"
              name="disk"
            >
              <Select
                allowClear
                placeholder="请选择位置"
                options={diskTypes}
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
            label="名称"
            name="name"
            rules={[{ required: true }]}
          >
            <Input allowClear placeholder="请输入名称" />
          </Item>
          <Item label="系列" name="series">
            <Select
              allowClear
              showSearch
              placeholder="请选择系列"
              optionFilterProp="name"
              options={seriesList}
              fieldNames={{ value: 'id', label: 'name' }}
            />
          </Item>
          <Item
            label="序号"
            name="idx"
          >
            <Input allowClear placeholder="请输入序号" />
          </Item>
          <Item label="演员" name="actors">
            <Select
              allowClear
              showSearch
              mode="multiple"
              placeholder="请选择演员"
              optionFilterProp="name"
              options={actorList}
              fieldNames={{ value: 'id', label: 'name' }}
            />
          </Item>
          <Item label="标签" name="tags">
            <Select
              allowClear
              showSearch
              mode="multiple"
              placeholder="请选择标签"
              optionFilterProp="name"
              options={tagList}
              fieldNames={{ value: 'id', label: 'name' }}
            />
          </Item>
          <Item
            label="状态"
            name="status"
          >
            <Select
              allowClear
              placeholder="请选择状态"
              options={statusTypes}
            />
          </Item>
          <Item
            label="位置"
            name="disk"
          >
            <Select
              allowClear
              placeholder="请选择位置"
              options={diskTypes}
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
