import request from '@/utils/request';
import { API_URL } from '../../public/config'
// import { stringify } from 'qs';
export async function add(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/addQuestion', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function del(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/delQuestion', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function detail(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/getOptionById', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function fetch(params: object): Promise<{}> {
  return request(API_URL + '/admin/sys/getAllQuestion', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

