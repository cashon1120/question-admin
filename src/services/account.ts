import request from '@/utils/request';
// import { stringify } from 'qs';

export async function del(params: object): Promise<any> {
  return request('/api/account_del', {
    method: 'POST',
    data: params,
  });
}

export async function add(params: object): Promise<any> {
  return request('/api/account_add', {
    method: 'POST',
    data: params,
  });
}

export async function fetch(params: object): Promise<{}> {
  return request('/api/account_fetch', {
    method: 'POST',
    data: params,
  });
}

export async function detail(params: object): Promise<{}> {
  return request('/api/userInfo', {
    method: 'POST',
    data: params,
  });
}
