export interface ActorSearchParams {
  name?: string;
  tag?: string;
}

interface ActorBase {
  name: string;
  age?: number;
  name1?: string;
  name2?: string;
  desc?: string;
}

export type ActorFieldsValue = ActorBase & {
  tags?: string[];
}

export type ActorEditParams = ActorBase & {
  tags?: string;
};
export type ActorListItem = ActorEditParams & { id: number; };

export interface TagSearchParams {
  name?: string;
  type?: string;
}

export interface TagFieldsValue {
  name: string;
  color: string;
  type: string;
  desc?: string;
}

export type TagEditParams = TagFieldsValue;
export type TagListItem = TagEditParams & { id: number };

export interface SeriesSearchParams {
  name?: string;
  type?: string;
}

export interface SeriesFieldsValue {
  name: string;
  full?: string;
  type: string;
  publisher?: string;
  desc?: string;
}

export type SeriesEditParams = SeriesFieldsValue;
export type SeriesListItem = SeriesEditParams & { id: number };

export interface SearchParams {
  name?: string;
  series?: number;
  idx?: string;
  actor?: number;
  tag?: string;
  status?: string;
  disk?: string;
}

interface Base {
  name: string;
  series?: number;
  idx?: string;
  actor?: number;
  status: string;
  disk?: string;
  desc?: string;
}

export type FieldsValue = Base & {
  tags?: string[];
}

export type EditParams = Base & {
  tags?: string;
};
export type ListItem = EditParams & { id: number; date: string };

interface TypeOption {
  label: string;
  value: string;
}

type TypeMap = Record<string, string>;

function getTypeMap(list: TypeOption[]) {
  return list.reduce((acc, cur) => {
    const { label, value } = cur;
    acc[value] = label;
    return acc;
  }, {} as TypeMap);
}

export const tagTypes = [
  { label: '演员', value: '1' },
  { label: '影片', value: '2' },
];
export const tagTypeMap = getTypeMap(tagTypes);
export const seriesTypes = [
  { label: '有码', value: '1' },
  { label: '无码', value: '2' },
];
export const seriesTypeMap = getTypeMap(seriesTypes);
export const statusTypes = [
  { label: '未下载', value: '1' },
  { label: '已下载', value: '2' },
  { label: '下载已删除', value: '3' },
];
export const statusTypeMap = getTypeMap(statusTypes);
export const diskTypes = [
  { label: 'Toshiba', value: '1' },
  { label: 'WD Elements', value: '2' },
  { label: 'WD New Elements', value: '3' },
];
export const diskTypeMap = getTypeMap(diskTypes);
export const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'].map(s => ({ value: s, label: s }));

export const headers = {
  'Content-Type': 'application/json;charset=utf-8',
};

export function request(url: string, options?: any) {
  return fetch(url, options).then(res => res.json());
}