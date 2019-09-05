import request from '@/utils/request';
// import { stringify } from 'qs';

export async function submit(params: object): Promise<any> {
  return request('/api/qcode_submit', {
    method: 'POST',
    data: params,
  });
}

export async function fetch(params: object): Promise<{}> {
  return request('/api/qcode_fetch', {
    method: 'POST',
    data: params,
  });
}
