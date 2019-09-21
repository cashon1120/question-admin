import request from '@/utils/request';
import { API_URL } from '../../public/config'

export async function login(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/login', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function getCode(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/regCode', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}
