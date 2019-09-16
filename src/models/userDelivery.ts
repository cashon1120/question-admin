import { Reducer } from 'redux';
import {  Effect } from 'dva';
import { fetch, exportFile, checkOut, detail, reCheckOut } from '@/services/userDelivery';

export interface UserDeliveryModelState {
  data: any;
}

export interface ModelType {
  namespace: string;
  state: UserDeliveryModelState;
  effects: {
    fetch: Effect;
    exportFile: Effect;
    checkOut:Effect;
    detail: Effect;
    reCheckOut: Effect
  };
  reducers: {
    saveData: Reducer<{}>;
  };
}

const LoginModel: ModelType = {
  namespace: 'userDelivery',

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
    
    *reCheckOut({ payload, callback }, { call }) {
      const response = yield call(reCheckOut, payload);
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
