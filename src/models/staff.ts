import { Reducer } from 'redux';
import {  Effect } from 'dva';
import { fetch, add, del, update, setImg, showPeople } from '@/services/staff';
import {fetch as fetchCompany} from '@/services/company'

export interface StaffModelState {
  data: any;
  companyData: any
}

export interface ModelType {
  namespace: string;
  state: StaffModelState;
  effects: {
    fetch: Effect;
    fetchCompany: Effect;
    add: Effect;
    del:Effect;
    update: Effect;
    setImg: Effect;
    showPeople: Effect
  };
  reducers: {
    saveData: Reducer<{}>;
    saveCompany: Reducer<{}>
  };
}

const LoginModel: ModelType = {
  namespace: 'staff',

  state: {
    data: [],
    companyData: []
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
    
    *showPeople({ payload, callback}, {put, call }) {
      const response = yield call(showPeople, payload);
      if(callback) {callback(response)}
    },
    *fetchCompany({ payload, callback}, {put, call }) {
      const response = yield call(fetchCompany, payload);
      if(response){
        yield put({
          type: 'saveCompany',
          payload: response,
        });
      }
      if(callback) {callback(response)}
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

    *update({ payload, callback }, { call }) {
      const response = yield call(update, payload);
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
    saveCompany(state, { payload }) {
      return {
        ...state,
        companyData: payload.data
      };
    },
  },
};

export default LoginModel;
