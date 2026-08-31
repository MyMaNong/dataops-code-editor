import * as monaco from 'monaco-editor';
import { EntityContextType, type EntityContext } from 'monaco-sql-languages';
import { AttrName } from 'dt-sql-parser/dist/parser/common/entityCollector.js';
import { isFunction, getAfterKeywordTable } from '../utils';
import { LanguageService } from '../service';
import type { IHoverMouseOver, HoverCallbacksReturn } from '../interface';

let disposers: { [key: string]: monaco.IDisposable | null } = {};

export const setupSqlHoverFeature = (
  editor: monaco.editor.IStandaloneCodeEditor,
  callback?: {
    onMouseOver?: (params: IHoverMouseOver) => HoverCallbacksReturn;
    onMouseOut?: () => void;
  },
  options?: {
    /**
     * Delay for showing the hover.
     * Defaults to 0ms.
     */
    delay?: number;
  },
) => {
  const delay = options?.delay ?? 0;
  const model = editor.getModel();
  const languageId = model?.getLanguageId();

  for (const key in disposers) {
    if (Object.prototype.hasOwnProperty.call(disposers, key)) {
      let disposable = disposers[key];
      disposable?.dispose();
      disposable = null;
    }
  }

  let hoverTimeout: NodeJS.Timeout | null = null;
  let entityPosition: EntityContext['position'] | undefined = void 0;

  if (languageId) {
    const onMouseOut = () => {
      // 清除已存在的定时器
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      callback?.onMouseOut?.();
      entityPosition = void 0;
    };

    disposers['onMouseMove'] = editor.onMouseMove(async e => {
      const type = e.target.type;
      const mouseTargetTypes = [monaco.editor.MouseTargetType.CONTENT_TEXT, monaco.editor.MouseTargetType.CONTENT_WIDGET];
      if (mouseTargetTypes.includes(type)) {
        if (type === monaco.editor.MouseTargetType.CONTENT_TEXT) {
          const position = e.target.position;
          if (!entityPosition) {
            return;
          }
          if (
            position.lineNumber !== entityPosition?.line ||
            position.column < entityPosition?.startColumn ||
            position.column > entityPosition?.endColumn
          ) {
            onMouseOut();
          }
        }
      } else {
        onMouseOut();
      }
    });

    disposers['onDidChangeCursorSelection'] = editor.onDidChangeCursorSelection(() => {
      onMouseOut();
    });

    disposers['onDidFocusEditorText'] = editor.onDidFocusEditorText(() => {
      onMouseOut();
    });

    const languageService = new LanguageService();
    disposers['hoverProvider'] = monaco.languages.registerHoverProvider(languageId, {
      provideHover: function (model, position) {
        // 每次新的hover请求进来时，先清除之前的定时器
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
        }

        // 返回一个Promise，在延迟后执行实际的hover逻辑
        return new Promise(resolve => {
          hoverTimeout = setTimeout(async () => {
            let params: IHoverMouseOver = { languageId, position };
            let result: HoverCallbacksReturn;
            const wordAtPosition = model.getWordAtPosition(position);
            if (!wordAtPosition) {
              onMouseOut();
              resolve(null);
              return;
            }
            const tableInfo = getAfterKeywordTable(model, position);
            if (tableInfo) {
              const { word, startColumn, endColumn, lineNumber } = tableInfo;
              const tables = word?.split('.') || [];
              const tableLength = tables?.length;
              const commonParams =
                tableLength === 2 ? { database: tables[0], tableName: tables[1] } : { catalog: tables[0], database: tables[1], tableName: tables[2] };
              const entity = { text: word, position: { line: lineNumber, startColumn, endColumn }, relatedEntities: null, belongStmt: null } as any;
              params = { ...params, ...commonParams, syntaxContextType: EntityContextType.TABLE, entity };
              entityPosition = entity.position;
              result = await callback?.onMouseOver?.(params);
              if (result) {
                const range = new monaco.Range(position.lineNumber, wordAtPosition.startColumn, position.lineNumber, wordAtPosition.endColumn);
                resolve({ range, ...result });
                return;
              }
              resolve(void 0);
              return;
            }

            const word = wordAtPosition.word;
            const { suggestions, allEntities } = await languageService.doCompletionWithEntities(languageId, model, position);
            const containCaretEntities = allEntities?.filter(({ belongStmt }) => belongStmt.isContainCaret);

            if (!suggestions?.syntax?.length) {
              onMouseOut();
              resolve(null);
              return;
            }

            for (const item of suggestions?.syntax) {
              const { syntaxContextType, wordRanges } = item;

              // e.g. words -> ['cat', '.', 'database', '.', 'table']
              const words = wordRanges.map(wr => wr.text);
              const wordCount = words.length;

              if (syntaxContextType === EntityContextType.COLUMN) {
                if (isFunction(model, position)) {
                  params = { ...params, syntaxContextType: EntityContextType.FUNCTION, functionName: word };
                } else {
                  let currentEntity: EntityContext | undefined;
                  if (wordCount <= 1) {
                    currentEntity = containCaretEntities?.[0];
                  } else if (wordCount >= 2 && words[1] === '.') {
                    const tbNameOrAlias = words[0];
                    currentEntity = containCaretEntities?.find(item => item[AttrName.alias]?.text === tbNameOrAlias);
                  }
                  const tables = currentEntity?.text?.split('.') || [];
                  const tableLength = tables?.length;
                  const commonParams =
                    tableLength === 2
                      ? { database: tables[0], tableName: tables[1] }
                      : { catalog: tables[0], database: tables[1], tableName: tables[2] };
                  params = {
                    ...params,
                    ...commonParams,
                    syntaxContextType,
                    columnName: word,
                    entity: currentEntity,
                  };
                }
              }
              if (syntaxContextType === EntityContextType.TABLE) {
                const currentEntity = containCaretEntities?.find(
                  item =>
                    position.lineNumber === item?.position?.line &&
                    position.column >= item?.position?.startColumn &&
                    position.column <= item?.position?.endColumn,
                );
                const tables = currentEntity?.text?.split('.') || [];
                const tableLength = tables?.length;
                const commonParams =
                  tableLength === 2
                    ? { database: tables[0], tableName: tables[1] }
                    : { catalog: tables[0], database: tables[1], tableName: tables[2] };
                params = { ...params, ...commonParams, syntaxContextType, entity: currentEntity };
              }
              if (syntaxContextType === EntityContextType.FUNCTION && isFunction(model, position)) {
                params = { ...params, syntaxContextType, functionName: word };
              }
              if (params?.syntaxContextType) {
                entityPosition = params?.entity?.position;
                result = await callback?.onMouseOver?.(params);
                break;
              }
            }

            if (!params?.syntaxContextType) {
              onMouseOut();
            }

            if (result) {
              const range = new monaco.Range(position.lineNumber, wordAtPosition.startColumn, position.lineNumber, wordAtPosition.endColumn);
              resolve({ range, ...result });

              return;
            }

            resolve(void 0);
          }, delay);
        });
      },
    });
  }

  return disposers['hoverProvider'];
};
