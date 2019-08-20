import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { query } from '@/services/user_info_auth';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submitForm: Effect;
  };
}
const Model: ModelType = {
  namespace: 'userInfoAuth',

  state: {},

  effects: {
    *submitForm({ payload }, { call }) {
      yield call(query, payload);
      message.success('提交成功');
    },
  },
};

export default Model;
