export interface ActorSearchParams {
  name?: string;
  tag?: number;
}

interface ActorBase {
  name: string;
  age?: number;
  name1?: string;
  name2?: string;
  desc?: string;
}

export type ActorFieldsValue = ActorBase & {
  tags?: number[];
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
  tag?: number;
  status?: string;
  disk?: string;
}

interface Base {
  name: string;
  series?: number;
  idx?: string;
  status: string;
  disk?: string;
  desc?: string;
}

export type FieldsValue = Base & {
  tags?: number[];
  actors?: number[];
}

export type EditParams = Base & {
  tags?: string;
  actors?: string;
};
export type ListItem = EditParams & { id: number; date: string };

interface TypeOption {
  label: string;
  value: string;
}

type TypeMap = Record<string, string>;
export type NumMap = Record<number, string>;
export type TagMap = Record<number, TagListItem>;

export function getIdListByIds(ids?: string) {
  if (!ids) return [];
  return ids.split(',').map(id => +id);
}

export function getNumMap<T extends { id: number; name: string; }>(list: T[]) {
  return list.reduce((acc, cur) => {
    const { id, name } = cur;
    acc[id] = name;
    return acc;
  }, {} as NumMap);
}

export function getTagMap(list: TagListItem[]) {
  return list.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {} as TagMap);
}

export function getNames(ids: string, idMap: NumMap) {
  if (!ids) return '';
  return getIdListByIds(ids).map(id => idMap[id]).join('，');
}

export function getTags(ids: string, tagMap: TagMap) {
  if (!ids) return [];
  return getIdListByIds(ids).map(id => tagMap[id]).filter(o => o);
}

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
  { label: '无码', value: '1' },
  { label: '有码', value: '2' },
];
export const seriesTypeMap = getTypeMap(seriesTypes);
export const statusTypes = [
  { label: '未下载', value: '1' },
  { label: '已下载', value: '2' },
  { label: '已删除', value: '3' },
];
export const statusColors = ['', 'default', 'processing', 'error'];
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

export function stringify(params: Object) {
  return Object.entries(params).reduce((acc, cur) => {
    const [k, v] = cur;
    if (v)
      acc.push(`${k}=${v}`);
    return acc;
  }, [] as string[]).join('&');
}