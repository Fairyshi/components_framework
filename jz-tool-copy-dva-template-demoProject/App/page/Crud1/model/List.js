/*
 * @Author: 嘉竹 (shifei.sf)
 */
import _ from 'lodash';
import { message } from 'antd';

import * as services from '@/service/index';

import {
  parseSearch,
  formatPager4ListResult,
  format4ListParam,
  getCeilPagerParams,
} from '@/util/index';

import modelEnhancer from '@/util/dva/mixin';

function getInitState() {
  return {
    // 搜索关键词
    keyword: '',
    // 筛选的推广状态
    status: '',
    campaignId: '',
    // 推广计划列表
    campaigns: [],
    adgroups: [],
    list: [],
    pager: {}
  };
}

export default modelEnhancer(
  {
    namespace: 'appFoo',
    state: getInitState(),
    subscriptions: {
      setup({ history, dispatch }) {
        return history.listen(({ pathname } )=> {
          if (pathname === 'todo') {
            dispatch({ type: 'init' });
          }
        });
      },
    },
    effects: {
      *init(_, { put, select }) {
        const search = _.get(window, 'location.search');
        const payload = parseSearch(search);

        if (search) {
          yield put({ type: 'updateFormInfo', payload });
        }
        // 查询条件中的推广计划列表
        yield put({ type: 'getBars', payload });
        yield put({ type: 'getFoos', payload });
      },
      *getBars({ payload }, { call, put }) {
        const pager = getCeilPagerParams();
        const result = yield call(services.getBars, { ...pager, ...payload });
        if (result.success) {
          const { list: campaigns } = formatPager4ListResult(result);
          yield put({
            type: 'updateFormInfo',
            payload: { campaigns },
          });
        } else {
          throw result;
        }
      },
      *getFoos({ payload }, { call, put, select }) {
        if (!_.isEmpty(payload)) {
          yield put({
            type: 'updateFormInfo',
            payload,
          });
        }

        const { list: localList, campaigns, ...params } = yield select(
          state => state.appFoo
        );
        const result = yield call(services.getAdgroupList, {
          ...format4ListParam(params),
          ...payload,
        });
        if (result.success) {
          const { list, pager } = formatPager4ListResult(result);
          yield put({
            type: 'updateFormInfo',
            payload: { list, pager },
          });
        } else {
          throw result;
        }
      },
      *deleteFoo({ payload }, { call, put, select }) {
        const result = yield call(services.deleteListItem, payload);
        if (result.success) {
          yield put({ type: 'getFoos', payload: {} });

          message.success('操作成功');
        } else {
          throw result;
        }
      },
      *enableFoo({ payload }, { call, put, select }) {
        const list = yield select(state => _.get(state, 'appFoo.list')) || [];
        const result = yield call(services.enableFoo, payload);
        if (result.success) {
          yield put({ type: 'getFoos', payload: {} });

          message.success('操作成功');
        } else {
          throw result;
        }
      },
    },
    reducers: {
      reset: () => getInitState()
    },
  },
  ['@@list']
);
