import { Reducer } from 'redux';
import {  Effect } from 'dva';
import { fetch, add, del, update, setImg } from '@/services/company';

export interface CompanyModelState {
  data: any;
}

export interface ModelType {
  namespace: string;
  state: CompanyModelState;
  effects: {
    fetch: Effect;
    add: Effect;
    del:Effect;
    update: Effect;
    setImg: Effect;
  };
  reducers: {
    saveData: Reducer<{}>;
  };
}

const LoginModel: ModelType = {
  namespace: 'company',

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
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (callback) {
        callback(response);
      }
    },

    *setImg({ payload, callback }, { call }) {
      const response = yield call(setImg, payload);
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

    *update({ payload, callback }, { call }) {
      const response = yield call(update, payload);
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
