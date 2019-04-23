/*
 * @Author: 嘉竹 (shifei.sf)
 */
import _ from 'lodash';
import { all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { message } from 'antd';
import update from 'immutability-helper-x';

import * as services from '@/service/index';
import { format4List } from '@/util/index';

import validateSlave2 from '@/page/todo';

// model-like(not dva model)：非真正的dva model实例信息。最终会被并入 main model 成为其中一部分
export default {
  state: {
    pageType: 'slave2Info', 
    id: '',
    ...createOriginalForm(),
  },
  effects: {
    *initSlave2Info({ payload }, { select, call, put }) {
      const { fidAdapter } = yield select(state => _.get(state, 'appFoo'));
      yield put({ type: 'resetSlave2Info', payload })
      
      const result = yield call(services.getSlave2nfo);
      if (result.success) {
        const data = format4List(result);
        const objWithFid = fidAdapter.formatListToObj(
          inApiAdapter(data), 
          { forceGroup: 'async' }
        );
        const asyncFids = Object.keys(objWithFid);

        if (!_.isEmpty(data)) {
          yield put({
            type: 'updateSlave2Info',
            payload: {
              asyncFids,
              ...objWithFid,
            },
          });
        }
      }
    },
    // 保存基本信息
    *saveSlave2Info(_, { call, put, select }) {
      const { slave2Info, fidAdapter } = yield select(state => _.get(state, 'appFoo'));
      const { todo } = outApiAdapter4Save(slave2Info, fidAdapter);

      const result = yield call(services.postSlave2nfo, 'todo add params');
      
      if (result.success) {
        yield put({
          type: 'updateSlave2Info',
          payload: { }
        });
        yield put({ 
          type: 'delSlave2Item', 
          payload: 'todo'
        });
        yield put({ 
          type: 'initSlave2Info', 
          payload: { keepSync: true } 
        });
      }
    },   
    *delSlave2InfoItem({ payload }, { call, put, select }) {
      const { fidAdapter } = yield select(state => _.get(state, 'appFoo'));
      const { fileId, fid } = payload;

      if (fidAdapter.isSync(fid)) {
        yield put({
          type: 'delSlave2Item',
          payload: fid
        });
      } else {
        const result = yield call(services.delSlave2nfo, null, 'todo add params');
        
        if (result.success) {
          message.success('删除成功');

          yield put({
            type: 'delSlave2Item',
            payload: fid
          });
        }
      }
    },
    *replaceSlave2Item ({ payload }, { call, put, select }) {
      const {  } = payload;
      const oldInfo = yield select(state => _.get(state, `appFoo.todo`));
      
      if (payload && oldInfo) {
        const result = yield call(services.replaceSlave2nfo, null, 'todo add params');
        
        if (result.success) {
          yield put({ 
            type: 'initSlave2Info', 
            payload: { keepSync: true } 
          });
        }
      }
    },
  },
  reducers: {
    updateSlave2Info: (state, { payload }) => (
      update.$merge(state, 'slave2Info', payload)
    ),
    updateSlave2FormInfo: (state, { payload }) => (
      update.$merge(state, 'slave2Info.formInfo', payload)
    ),
    updateSlave2ErrorInfo: (state, { payload }) => (
      update.$merge(state, 'slave2Info.errorInfo', payload)
    ),
    delSlave2Item(state, { payload }) {
      const slave2Info = _.get(state, 'slave2Info');

      return { 
        ...state,
        slave2Info: { ...value }
      };
    },
    resetSlave2Info(state, { payload }) {
      return {
        ...state,
        ...createOriginalForm()
      };
    },
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
    slave2Info: {
      readOnly: false,
      asyncFids: [],
    },
  };
  return _.cloneDeep({ ...orignalForm, ...opts });
}

/*
 * @component 后端接口数据适配
 */ 
function inApiAdapter(list = []) {
  return list;
}

// 提交审核前根据选中项提交对应的图片fileId
function outApiAdapter4Save(slaveInfo = {}, fidAdapter) {
  return slave2Info;
}
