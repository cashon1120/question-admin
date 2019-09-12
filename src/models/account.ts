import { Reducer } from 'redux';
import {  Effect } from 'dva';
import { fetch, setTime, setAnswerTime, getSetting, getAnswerTime } from '@/services/account';

export interface AccountModelState {
  data: any;
}

export interface ModelType {
  namespace: string;
  state: AccountModelState;
  effects: {
    setTime: Effect;
    setAnswerTime:Effect;
    getSetting: Effect;
    getAnswerTime: Effect
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
    *getAnswerTime({ payload, callback}, {put, call }) {
      const response = yield call(getAnswerTime, payload);
      if (callback) {
        callback(response);
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
    
    *setAnswerTime({ payload, callback }, { call }) {
      const response = yield call(setAnswerTime, payload);
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
