/*
 * @Author: 嘉竹 (shifei.sf)
 * @file 创建|编辑 表单校验规则
 */
import { isAutoPrice, isSmartPrice, isRangeRelease } from '@/util/index';
import Validate, { validateCommand } from '@/component/validatorDp';

// 校验规则
export const rules = {
  campaignId: {
    required: true,
    '@type@': 'number',
    transform: 'number',
  },
  name: { required: true, max: 20 },
  mediaIds: {
    required: true,
    '@type@': 'array',
    defaultField: {
      '@type@': 'number',
      transform: 'number',
      required: true,
    },
  },
  crowdId: {
    required: true,
    '@type@': 'array',
    defaultField: {
      '@type@': 'string',
      required: true,
    },
  },
  budget: { required: true, '@type@': 'number', transform: 'number' },
  bidding: {
    required: true,
    '@type@': 'object',
    fields: {
      sort: { required: true },
      type: { required: true },
      config: {
        '@type@': 'array',
        fields: {
          0: {
            required: true,
            '@type@': 'number',
            transform: 'number',
            before: metaData => {
              const info = _.get(metaData, 'dataSource_');
              const isAuto = isAutoPrice(info);
              if (!isAuto) return false;
            },
          },
          1: {
            required: true,
            '@type@': 'number',
            transform: 'number',
            before: metaData => {
              const info = _.get(metaData, 'dataSource_');
              const isSmart = isSmartPrice(info);
              if (!isSmart) return false;
            },
          },
        },
      },
    },
  },
  release: {
    required: true,
    '@type@': 'object',
    fields: {
      type: { required: true },
      config: {
        '@type@': 'array',
        fields: {
          0: { required: true },
          1: {
            required: true,
            before: metaData => {
              const info = _.get(metaData, 'dataSource_');

              const isRange = isRangeRelease(info);
              if (!isRange) return false;
            },
          },
        },
      },
    },
  },
  period: {
    '@type@': 'object',
    required: true,
    fields: {
      type: { required: true },
      maxFreq: {
        required: true,
        '@type@': 'integer',
        transform: 'number',
      },
    },
  },
};

const validateHelper = new Validate(rules, {
  // first: true,
  langConfig: {
    campaignId: '推广计划',
    name: '推广组',
    mediaIds: '推广媒体',
    crowdId: '定向人群',
    budget: '预算',
    bidding: {
      sort: '出价类型',
      type: '出价',
      config: {
        0: '价格',
        1: '兜底价',
      },
    },
    release: {
      type: '投放时间',
      config: {
        0: '开始时间',
        1: '结束时间',
      },
    },
    period: {
      type: '投放类型',
      maxFreq: '投放频次上限',
    },
  },
  /*   cases: {
    case1: ['campaignId'],
  } */
});
// validateHelper.setCase('case2', ['name']);

export default function validate(formInfo) {
  return validateCommand(validateHelper, formInfo);
}
