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
  return request(API_URL + '/admin/sys/settingTime', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function setAnswerTime(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/settingAnswerTime', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function getAnswerTime(params: object): Promise<any> {
  return request(API_URL + '/admin/sys/getAnswerTime', {
    method: 'POST',
    requestType: 'form',
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

export async function getSmJoin(params: object): Promise<{}> {
  return request(API_URL + '/app/applets/smJoin', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}

export async function setSmJoin(params: object): Promise<{}> {
  return request(API_URL + '/admin/sys/updSmJoin', {
    method: 'POST',
    requestType: 'form',
    data: params,
  });
}
