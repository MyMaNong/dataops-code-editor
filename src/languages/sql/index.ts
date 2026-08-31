import * as monaco from 'monaco-editor';
import { setupSqlTheme } from './theme';
import 'monaco-sql-languages/esm/languages/spark/spark.contribution.js';
import 'monaco-sql-languages/esm/languages/hive/hive.contribution.js';
import 'monaco-sql-languages/esm/languages/flink/flink.contribution.js';
import { LanguageIdEnum, setupLanguageFeatures } from 'monaco-sql-languages';
import { getCompletionService } from './helpers/completionService';
import type { ILanguageSqlSetup, IEditorConfig, ICompletionCallbacks } from './interface';

setupSqlTheme();

/**
 * replace dtstack custom params, eg: @@{componentParams}, ${taskCustomParams}
 * @param code editor value
 * @returns replaced string
 */
export const preprocessCode = (code: string): string => {
  const regex1 = /@@{[A-Za-z0-9._-]*}/g;
  const regex2 = /\${[A-Za-z0-9._-]*}/g;
  let result = code;
  if (regex1.test(code)) {
    result = result.replace(regex1, str => {
      return str.replace(/@|{|}|\.|-/g, '_');
    });
  }
  if (regex2.test(code)) {
    result = result.replace(regex2, str => {
      return str.replace(/\$|{|}|\.|-/g, '_');
    });
  }
  return result;
};

/**
 * replace dtstack custom grammar, eg: @@{componentParams}, ${taskCustomParams}
 * @param code editor value
 * @param mark some sql grammar need special mark to replace the beginning and the end
 * @returns replaced string
 */
export const preprocessCodeHive = (code: string, mark?: string): string => {
  const regex1 = /@@{[A-Za-z0-9._-]*}/g;
  const regex2 = /\${[A-Za-z0-9._-]*}/g;
  let result = code;

  if (regex1.test(code)) {
    result = result.replace(regex1, str => {
      if (mark) {
        return str
          .replace(/@/, mark)
          .replace(/}/, mark)
          .replace(/@|{|\.|-/g, '_');
      }
      return str.replace(/@|{|}|\.|-/g, '_');
    });
  }
  if (regex2.test(code)) {
    result = result.replace(regex2, str => {
      if (mark) {
        return str.replace(/\$|}/g, mark).replace(/{|\.|-/g, '_');
      }
      return str.replace(/\$|{|}|\.|-/g, '_');
    });
  }
  return result;
};

export const setupSqlLanguageFeature = <T extends IEditorConfig>(params: ILanguageSqlSetup<T>, callbacks?: ICompletionCallbacks) => {
  const { editor, editorConfig, languageConfig } = params;
  const readOnly = editor.getOption(monaco.editor.EditorOption.readOnly);
  const model = editor.getModel();
  const languageId = model?.getLanguageId();
  const completionService = getCompletionService<T>(editorConfig, callbacks);

  if (!readOnly && languageId) {
    setupLanguageFeatures(languageId as any, {
      completionItems: {
        enable: true,
        completionService,
        triggerCharacters: languageConfig?.triggerCharacters || ['.'],
      },
      preprocessCode: languageId === LanguageIdEnum.HIVE ? (code: string) => preprocessCodeHive(code, '`') : preprocessCode,
      diagnostics: editorConfig?.diagnostics || languageConfig?.diagnostics,
    });
  }
};

export * from './helpers';
export * from './constants';
export * from './utils';
export * from 'monaco-sql-languages';

export type * from './interface';
