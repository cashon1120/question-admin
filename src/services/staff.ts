import request from '@/utils/request';
import { API_URL } from '../../public/config'

export async function del(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/delStaff', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function add(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/addStaff', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function update(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/updStaff', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function fetch(params: object): Promise<{}> {
  return request(API_URL + '/admin/sys/getStaffList', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

