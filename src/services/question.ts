import request from '@/utils/request';
// import { stringify } from 'qs';

export async function add(params: object): Promise<any> {
  return request('/api/question_add', {
    method: 'POST',
    data: params,
  });
}

export async function del(params: object): Promise<any> {
  return request('/api/question_del', {
    method: 'POST',
    data: params,
  });
}

export async function detail(params: object): Promise<any> {
  return request('/api/question_detail', {
    method: 'POST',
    data: params,
  });
}

export async function fetch(params: object): Promise<{}> {
  return request('/api/question_fetch', {
    method: 'POST',
    data: params,
  });
}

