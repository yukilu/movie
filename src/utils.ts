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
export type ActorListItem = ActorEditParams & { id: string; };

export const headers = {
  'Content-Type': 'application/json;charset=utf-8',
};

export function request(url: string, options?: any) {
  return fetch(url, options).then(res => res.json());
}