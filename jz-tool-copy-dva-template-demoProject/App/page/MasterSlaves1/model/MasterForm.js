/*
 * @Author: 嘉竹 (shifei.sf)
 */
import _ from 'lodash';
import { all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { message } from 'antd';

import * as services from '@/service/index';
import { modelMixer } from '@/util/dva/mixin';

import { FidGroupedAdapter, getPageTypeFromLocation } from '@/util/index';

import slave1ModelLike from './_slave1';
import slave2ModelLike from './_slave2';

const fidAdapter = new FidGroupedAdapter('appFoo');

export default modelMixer({
  namespace: 'appFoo',
  state: {
    pageType: 'slave1Info', 
    id: '',
    fidAdapter,
    ...createOriginalForm(),
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname } )=> {
        if (pathname === '/app/todo') {
          dispatch({ type: 'init' });
        }
      });
    },
  },
  effects: {
    *init(_, { put, select }) {
      const { queryObj, pageType } = getPageTypeFromLocation();

      const initFn = _.camelCase(['init', pageType]);
      yield put({
        type: 'updateFormInfo',
        payload: { pageType },
      });
      
      yield put({
        type: initFn,
        payload: { 
          ..._.omit(queryObj, 'pageType') 
        },
      });
    },
    * todo({ payload }, { call, put, select }) {
      const {  } = payload;
      if (true) {
        const result = yield call(services.todo, null, 'todo add params');
  
        if (result.success) {
        }
      }
    },
  },
  reducers: {
    updateFormInfo(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },
}, [slave1ModelLike, slave2ModelLike]);

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
      errorInfo: {},
    },
    slave2Info: {
      readOnly: false,
      list: [],
    },
    otherInfos: {},
  };
  return _.cloneDeep({ ...orignalForm, ...opts });
}