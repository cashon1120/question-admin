import request from '@/utils/request';
import { API_URL } from '../../public/config'

export async function del(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/delCompany', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function add(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/addCompany', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function update(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/updCompany', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function fetch(params: object): Promise<{}> {
  return request(API_URL + '/admin/sys/getCompanyList', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

