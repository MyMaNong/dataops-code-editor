import * as monaco from 'monaco-editor';
import { LanguageIdMap } from '../../../constants';

export const setupLogViewerMonarchTokensProvider = (params?: monaco.languages.IMonarchLanguage) => {
  const { tokenizer = {}, ...args } = params || {};

  // 语义分词规则定义
  monaco.languages.setMonarchTokensProvider(LanguageIdMap.LOG_VIEWER, {
    // 定义匹配目标
    errorLevels: ['ERROR', 'FATAL', 'FAIL', 'FAILED', 'CRITICAL', '[ERROR]', '[FATAL]', '[FAIL]', '[FAILED]', '[CRITICAL]'],
    warnLevels: ['WARN', 'WARNING', 'UNABLE', '[WARN]', '[WARNING]', '[UNABLE]'],
    infoLevels: ['INFO', 'DEBUG', '[INFO]', '[DEBUG]'],
    timeoutLevels: ['TIMEOUT', '[TIMEOUT]'],
    tokenizer: {
      root: [
        // 完整时间戳识别 (支持多种格式)
        [/\d{4}[-/]\d{2}[-/]\d{2}[\sT]\d{2}:\d{2}(:\d{2})?(\.\d+)?([+-]\d{2}:?\d{2}|Z)?/, 'timestamp'],

        // 日期识别 (如果更完整的时间戳未匹配到)
        [/\d{4}[-/]\d{2}[-/]\d{2}/, 'date'],

        // 错误级别识别 - 括号格式
        [
          /[\[\{\(（【] *(ERROR|FATAL|WARN|INFO|DEBUG|FAIL|FAILED|CRITICAL|WARNING|UNABLE|TIMEOUT) *[\]\}\)）】]/i,
          {
            cases: {
              '@errorLevels': 'error-level',
              '@warnLevels': 'warn-level',
              '@infoLevels': 'info-level',
              '@timeoutLevels': 'timeout-level',
            },
          },
        ],

        // 错误级别识别 - 普通格式
        [
          /\b(ERROR|FATAL|WARN|INFO|DEBUG|FAIL|FAILED|CRITICAL|WARNING|UNABLE|TIMEOUT)\b/i,
          {
            cases: {
              '@errorLevels': 'error-level',
              '@warnLevels': 'warn-level',
              '@infoLevels': 'info-level',
              '@timeoutLevels': 'timeout-level',
            },
          },
        ],

        // 网络相关识别
        [/(https?:\/\/\S+)/, 'url'],
        [/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, 'ip'],
        [/\b([1-5]\d{2})\b/, 'status-code'],

        // 数据结构识别
        [/\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/, 'uuid'],
        [/(\{[\s\S]*?\}|\[[\s\S]*?\])/, 'json'],

        // 布尔值识别
        [/\b(true|false)\b/i, 'boolean'],
      ],
      ...tokenizer,
    },
    ignoreCase: true,
    ...args,
  });
};
