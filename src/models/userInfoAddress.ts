import { Effect } from 'dva';
import { Reducer } from 'redux';
import { query, add } from '@/services/user_info_address';

export interface DataList {
  list?: [];
  total?: number;
  pageSize?: number;
}

export interface UserInfoAddressModelState {
  data?: DataList;
}

export interface UserModelType {
  namespace: 'userInfoAddress';
  state: UserInfoAddressModelState;
  effects: {
    fetch: Effect;
    add: Effect;
  };
  reducers: {
    saveAddressList: Reducer<UserInfoAddressModelState>;
  };
}

const UserInfoAddressModel: UserModelType = {
  namespace: 'userInfoAddress',

  state: {
    data: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'saveAddressList',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      callback(response);
    },
  },

  reducers: {
    saveAddressList(state, action) {
      return {
        ...state,
        data: action.payload || {},
      };
    },
  },
};

export default UserInfoAddressModel;
