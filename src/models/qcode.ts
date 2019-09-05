import { Reducer } from 'redux';
import {  Effect } from 'dva';
import { submit, fetch } from '@/services/qcode';

export interface QcodeModelState {
  data: any;
}

export interface ModelType {
  namespace: string;
  state: QcodeModelState;
  effects: {
    submit: Effect;
    fetch: Effect;
  };
  reducers: {
    saveData: Reducer<{}>;
  };
}

const LoginModel: ModelType = {
  namespace: 'qcode',

  state: {
    data: [],
  },

  effects: {
    *submit({ payload, callback}, {put, call }) {
      const response = yield call(submit, payload);
      if(callback){
        callback(response)
      }
    },
    *fetch({ payload, callback }, { call }) {
      const response = yield call(fetch, payload);
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
