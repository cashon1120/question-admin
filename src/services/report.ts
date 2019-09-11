import request from '@/utils/request';
import { API_URL } from '../../public/config'

export async function checkOut(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/delivery', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}


export async function fetch(params: object): Promise<{}> {
  return request(API_URL + '/admin/sys/getExamList', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function detail(params: object): Promise<{}> {
  return request(API_URL + '/admin/sys/getExamDetailById', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}
