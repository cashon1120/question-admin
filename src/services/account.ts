import request from '@/utils/request';
import { API_URL } from '../../public/config'

export async function getSetting(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/getSettingTime', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function setTime(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/settingAnswerTime', {
    method: 'POST',
    data: params,
  });
}

export async function fetch(params: object): Promise<{}> {
  return request(API_URL + '/admin/sys/getCandidateList', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function detail(params: object): Promise<{}> {
  return request(API_URL + '/admin/sys/getCandidateById', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}
