import { Reducer } from 'redux';
import {  Effect } from 'dva';
import { fetch, setTime, del, getSetting } from '@/services/account';

export interface AccountModelState {
  data: any;
}

export interface ModelType {
  namespace: string;
  state: AccountModelState;
  effects: {
    fetch: Effect;
    setTime: Effect;
    del:Effect;
    getSetting: Effect;
  };
  reducers: {
    saveData: Reducer<{}>;
  };
}

const LoginModel: ModelType = {
  namespace: 'account',

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

    *setTime({ payload, callback }, { call }) {
      const response = yield call(setTime, payload);
      if (callback) {
        callback(response);
      }
    },

    *getSetting({ payload, callback }, { call }) {
      const response = yield call(getSetting, payload);
      if (callback) {
        callback(response);
      }
    },
    
    *del({ payload, callback }, { call }) {
      const response = yield call(del, payload);
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
