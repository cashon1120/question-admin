import { Reducer } from 'redux';
import {  Effect } from 'dva';
import { fetch, exportFile, checkOut, detail } from '@/services/userInfo';

export interface UserInfoModelState {
  data: any;
}

export interface ModelType {
  namespace: string;
  state: UserInfoModelState;
  effects: {
    fetch: Effect;
    exportFile: Effect;
    checkOut:Effect;
    detail: Effect
  };
  reducers: {
    saveData: Reducer<{}>;
  };
}

const LoginModel: ModelType = {
  namespace: 'userInfo',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload}, {put, call }) {
      const response = yield call(fetch, payload);
      if(response){
        yield put({
          type: 'saveData',
          payload: response,
        });
      }
    },
    *exportFile({ payload, callback }, { call }) {
      const response = yield call(exportFile, payload);
      if (callback) {
        callback(response);
      }
    },

    *checkOut({ payload, callback }, { call }) {
      const response = yield call(checkOut, payload);
      if (callback) {
        callback(response);
      }
    },

    *detail({ payload, callback }, { call }) {
      const response = yield call(detail, payload);
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        data: payload.data
      };
    },
  },
};

export default LoginModel;
