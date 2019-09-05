import { Reducer } from 'redux';
import {  Effect } from 'dva';
import { fetch, add, detail, del } from '@/services/question';

export interface QuestionModelState {
  data: any;
}

export interface ModelType {
  namespace: string;
  state: QuestionModelState;
  effects: {
    fetch: Effect;
    add: Effect;
    del: Effect;
    detail: Effect;
  };
  reducers: {
    saveData: Reducer<{}>;
  };
}

const LoginModel: ModelType = {
  namespace: 'question',

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
    *del({ payload, callback }, { call }) {
      const response = yield call(del, payload);
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
