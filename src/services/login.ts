import request from '@/utils/request';

export async function login(params: object): Promise<any> {
  return request('/api/userlogin', {
    method: 'POST',
    data: params,
  });
}
