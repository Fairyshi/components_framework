/*
 * @Author: 嘉竹 (shifei.sf)
 */
import _ from 'lodash';
import update from 'immutability-helper-x';
import { all } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import * as services from '@/service/index';

import {
  parseSearch,
  formatResult4Select,
  getCeilPagerParams,
  apiAdapter4FormRevert,
  apiAdapter4FormTransfer,
  successTipAndRoute,
  isDetailLike,
  isCreateLike,
  isExisted,
  getPath,
} from '@/util/index';

import modelEnhancer from '@/util/dva/mixin';

import validate from '@/todo';

export default modelEnhancer(
  {
    namespace: 'appFoo',
    state: {
      todoOtherList: [],
    },
    effects: {
      *init(_, { put, select }) {
        const { pathname, search } = window.location;
        const payload = getCeilPagerParams();
        const queryObj = parseSearch(search) || {};
        if (isCreateLike(pathname)) {
          yield put({ type: 'reset' });

          // 创建的情况下从URL中带参数进入
          if (queryObj) {
            if ('campaignId' in queryObj) {
              yield put({
                type: 'updateFormInfo',
                payload: { campaignId: queryObj.campaignId },
              });
            }
          }
          yield put({ type: 'getResources', payload });
        } else {
          const id = queryObj.id;
          if (isExisted(id)) {
            // 详情页
            yield put({
              type: 'updateReadOnly',
              payload: isDetailLike(pathname),
            });
          }
        }
      },
      *getResources({ payload }, { call, put }) {
        yield all([
          call(function*(payload) {
            yield put({ type: 'getBars', payload });
          }, payload),
        ]);
      },
      *getBars({ payload }, { call, put, select }) {
        const result = yield call(services.getBars, payload);
        if (result.success) {
          yield put({
            type: 'updateState',
            payload: { todoOtherList: formatResult4Select(result) },
          });
        } else {
          throw result;
        }
      },
      *getFoo({ payload }, { call, put, select }) {
        if (payload) {
          const result = yield call(services.getFoo, payload);
          if (result.success) {
            const formInfo = apiAdapter4FormRevert(result.data, [ ]);
            yield put({
              type: 'updateFormInfo',
              payload: { ...formInfo, toAsyncForm: true },
            });
          } else {
            throw result;
          }
        }
      },
      // 点击保存
      *save({ payload }, { call, put, select }) {
        const { formInfo, mediaFilterInfo } = yield select(state => _.get(state, 'appFoo'));
        const { currentId /* 组id */, reqData } = getToStoreInfo(formInfo, mediaFilterInfo);

        // 前端基础校验
        const validateResult = validate(formInfo);

        if (validateResult === true) {
          // 创建
          if (!currentId && currentId !== 0) {
            const result = yield call(services.createAdgroup, null, reqData);
            yield call(handleResult, result);
          } else {
            const result = yield call(services.affectCreative, currentId, reqData);
            yield call(handleAffectCreativeResult, result);
          }
        } else {
          yield put({
            type: 'updateErrorInfo',
            payload: validateResult,
          });
        }
      },
    },
    reducers: {
      updateState: (state, { payload }) => ({ ...state, ...payload }),
    },
  },
  ['@@form', createOriginalForm, createOriginalError]
);

/**
 * 表单的初始值(初始化 or 取消重置场景）
 * case1: 新增 即为 orignalForm
 * case2: 编辑 即为 orignalForm + opts(异步返回的表单数据) 值
 * @param {object} opts
 */
function createOriginalForm(opts = {}) {
  const orignalForm = {
    campaignId: '', // 推广计划id
    id: '', // 推广组id
  };
  return _.cloneDeep({ ...orignalForm, ...opts });
}

/**
 * 表单的错误信息
 */
function createOriginalError() {
  return {
    campaignId: null, 
  };
}