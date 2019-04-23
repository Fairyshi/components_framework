/*
 * @Author: 嘉竹 (shifei.sf)
 */
import _ from 'lodash';
import update from 'immutability-helper-x';

import * as services from '@/service/index';
import { message } from 'antd';
  
import validateSlave1 from '@/page/todo';
 
// model-like(not dva model)：非真正的dva model实例信息。最终会被并入 main model 成为其中一部分
export default {
  state: {
    pageType: 'slave1Info', 
    id: '',
    ...createOriginalForm()
  },
  effects: {
    *initSlave1Info(_, { call, put }) {
      const result = yield call(services.getSlave1Info);
      if (result.success) {
        yield put({
          type: 'updateSlave1FormInfo',
          payload: result.data,
        });
      }
    },
    // 保存基本信息
    *saveSlave1Info(_, { call, put, select }) {
      const { formInfo } = yield select(state => _.get(state, '{{appNamespace}}.slave1Info'));

      // 前端基础校验
      const validateResult = validateSlave1(formInfo);

      if (validateResult === true) {
        const result = yield call(services.postSlave1Info, formInfo);
        
        if (result.success) message.success('保存成功');
      } else {
        yield put({
          type: 'updateSlave1ErrorInfo',
          payload: validateResult,
        });
      }
    },    
  },
  reducers: {
    updateSlave1FormInfo: (state, { payload }) => (
      update.$merge(state, 'slave1Info.formInfo', payload)
    ),
    updateSlave1ErrorInfo: (state, { payload }) => {
      const { fid, errorInfo } = payload;
      return update.$merge(state, `slave1Info.errorInfo`, payload);
    },
    resetSlave1Info: (state, { payload }) => ({ ...state, ...createOriginalForm() }),
  },
};

/**
 * 表单的初始值(初始化 or 取消重置场景）
 * case1: 新增 即为 orignalForm
 * case2: 编辑 即为 orignalForm + opts(异步返回的表单数据) 值
 * @param {object} opts
 */
function createOriginalForm(opts = {}) {
  const orignalForm = {
    slave1Info: {
      readOnly: false,
      formInfo: {},
      reviewInfo: {},
      errorInfo: {},
    },
  };
  return _.cloneDeep({ ...orignalForm, ...opts });
}