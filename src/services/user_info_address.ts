import { stringify } from 'qs';
import request from '@/utils/request';

export async function get(params: object): Promise<{}> {
  return request(`/api/userinfo_address?${stringify(params)}`);
}

export async function query(params: object) {
  return request('/api/userinfo_address', {
    method: 'POST',
    data: params,
  });
}

export async function add(params: object) {
  return request('/api/userinfo_address_add', {
    method: 'POST',
    data: params,
  });
}
