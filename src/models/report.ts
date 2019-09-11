import { Reducer } from 'redux';
import {  Effect } from 'dva';
import { fetch, detail, checkOut } from '@/services/report';

export interface ReportModelState {
  data: any;
}

export interface ModelType {
  namespace: string;
  state: ReportModelState;
  effects: {
    fetch: Effect;
    detail: Effect;
    checkOut:Effect;
  };
  reducers: {
    saveData: Reducer<{}>;
  };
}

const LoginModel: ModelType = {
  namespace: 'report',

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
    *detail({ payload, callback }, { call }) {
      const response = yield call(detail, payload);
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
