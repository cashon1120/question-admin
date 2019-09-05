import request from '@/utils/request';
// import { stringify } from 'qs';

export async function checkOut(params: object): Promise<any> {
  return request('/api/checkout', {
    method: 'POST',
    data: params,
  });
}

export async function exportFile(params: object): Promise<any> {
  return request('/api/exportFile', {
    method: 'POST',
    data: params,
  });
}

export async function fetch(params: object): Promise<{}> {
  return request('/api/userInfo', {
    method: 'POST',
    data: params,
  });
}
