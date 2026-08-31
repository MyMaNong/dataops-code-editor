import * as monaco from 'monaco-editor';
import { CommonEntityContext, CompletionService, EntityContextType, ICompletionItem, WordRange } from 'monaco-sql-languages';
import { keywordPriority } from '../constants';
import { getRangeValue } from '../utils';
import { AttrName } from 'dt-sql-parser/dist/parser/common/entityCollector.js';
import type { IEditorConfig, ICompletionCallbacks } from '../interface';

const haveCatalogSQLType = (languageId: string) => {
  return ['flinksql', 'trinosql', 'hivesql', 'sparksql'].includes(languageId.toLowerCase());
};

const namedSchemaSQLType = (languageId: string) => {
  return ['trinosql', 'hivesql', 'sparksql'].includes(languageId);
};

const isWordRangesEndWithWhiteSpace = (wordRanges: WordRange[]) => {
  return wordRanges.length > 1 && wordRanges.at(-1)?.text === ' ';
};

const isWordRangesEndWithSpot = (wordRanges: WordRange[]) => {
  return wordRanges.length > 1 && wordRanges.at(-1)?.text === '.';
};

export const getCompletionService = function <T extends IEditorConfig>(editorConfig?: T, callbacks?: ICompletionCallbacks) {
  const completionService: CompletionService = async function (model, _position, _completionContext, suggestions, entities) {
    if (!suggestions) {
      return Promise.resolve([]);
    }

    const languageId = model.getLanguageId();
    const haveCatalog = haveCatalogSQLType(languageId);
    const getDBOrSchema = namedSchemaSQLType(languageId) ? callbacks?.getSchemas : callbacks?.getDataBases;

    const { keywords, syntax } = suggestions;
    const uniqueSyntax = Array.from(new Map(syntax.map(item => [item.syntaxContextType, item])).values());

    console.log('suggestions', suggestions);
    console.log('uniqueSyntax', uniqueSyntax);
    console.log('entities', entities);

    // const keywordGroupNames = Object.keys(keywordGroup).filter(key => keywords.includes(key));

    // if (keywordGroupNames.length) {
    //   for (const name of keywordGroupNames) {
    //     keywords.push(...keywordGroup[name]);
    //   }
    // }

    let keywordsCompletionItems: ICompletionItem[] = editorConfig?.keywordCompletion
      ? keywords.map(kw => ({
          label: { label: kw, description: '关键词' },
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw + ' ',
          sortText: keywordPriority[kw] || keywordPriority.default + kw,
        }))
      : [];

    const snippetsCompletionItems: ICompletionItem[] =
      editorConfig?.sqlCodeSnippet && editorConfig?.sqlCodeSnippetTemplate
        ? editorConfig?.sqlCodeSnippetTemplate?.split('\n').map(kw => {
            const [label, insertText] = kw.split('=');
            return {
              label: { label, description: '代码片段', detail: ' ' + insertText },
              kind: monaco.languages.CompletionItemKind.Snippet,
              detail: '代码片段',
              sortText: '3' + label,
              documentation: insertText,
              insertText: insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            };
          })
        : [];

    let syntaxCompletionItems: ICompletionItem[] = [];

    /** 是否已经存在 catalog 补全项 */
    let existCatalogCompletions = false;
    /** 是否已经存在 database 补全项 tmpDatabase */
    let existDatabaseCompletions = false;
    /** 是否已经存在 database 补全项 */
    let existDatabaseInCatCompletions = false;
    /** 是否已经存在 table 补全项 tmpTable */
    let existTableCompletions = false;
    /** 是否已经存在 tableInDb 补全项 （cat.db.table） */
    let existTableInDbCompletions = false;
    /** 是否已经存在 view 补全项 tmpDb */
    let existViewCompletions = false;
    /** 是否已经存在 viewInDb 补全项  */
    let existViewInDbCompletions = false;

    for (let i = 0; i < uniqueSyntax.length; i++) {
      const { syntaxContextType, wordRanges } = uniqueSyntax[i];

      // e.g. words -> ['cat', '.', 'database', '.', 'table']
      const words = wordRanges.map(wr => wr.text);
      const wordCount = words.length;

      /**
       * 在做上下文判断时，如果已经键入了空格，则表示已经离开了该上下文。
       * 如: SELECT id  |  FROM t1
       * 光标所处位置在id后且键入了空格，虽然收集到的上下文信息中包含了`EntityContextType.COLUMN`，但不应该继续补全字段, table同理
       */
      if (isWordRangesEndWithWhiteSpace(wordRanges)) continue;

      /**
       * 在做上下文判断时，如果最后一位存在【点】，则表示正在输入库表。
       * 将关键字置为空
       */
      if (isWordRangesEndWithSpot(wordRanges)) {
        keywordsCompletionItems = [];
      }

      if (syntaxContextType === EntityContextType.CATALOG || syntaxContextType === EntityContextType.DATABASE_CREATE) {
        if (!existCatalogCompletions && wordCount <= 1 && callbacks?.getCatalogs) {
          syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getCatalogs(languageId));
          existCatalogCompletions = true;
        }
      }

      if (
        syntaxContextType === EntityContextType.DATABASE ||
        syntaxContextType === EntityContextType.TABLE_CREATE ||
        syntaxContextType === EntityContextType.VIEW_CREATE
      ) {
        if (!existCatalogCompletions && haveCatalog && wordCount <= 1 && callbacks?.getCatalogs) {
          syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getCatalogs(languageId));
          existCatalogCompletions = true;
        }

        if (!existDatabaseCompletions && wordCount <= 1 && getDBOrSchema) {
          syntaxCompletionItems = syntaxCompletionItems.concat(await getDBOrSchema(languageId));
          existDatabaseCompletions = true;
        }

        if (!existDatabaseInCatCompletions && haveCatalog && wordCount >= 2 && wordCount <= 3 && getDBOrSchema) {
          syntaxCompletionItems = syntaxCompletionItems.concat(await getDBOrSchema(languageId, words[0], words[2]));
          existDatabaseInCatCompletions = true;
        }
      }

      if (syntaxContextType === EntityContextType.TABLE) {
        if (wordCount <= 1) {
          if (!existCatalogCompletions && haveCatalog && callbacks?.getCatalogs) {
            const ctas = await callbacks.getCatalogs(languageId);
            syntaxCompletionItems = syntaxCompletionItems.concat(ctas || []);
            existCatalogCompletions = true;
          }

          if (!existDatabaseCompletions && getDBOrSchema) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await getDBOrSchema(languageId));
            existDatabaseCompletions = true;
          }

          if (!existTableCompletions && callbacks?.getTables) {
            const createTables =
              entities
                ?.filter(entity => entity.entityContextType === EntityContextType.TABLE_CREATE)
                .map(tb => ({
                  label: tb.text,
                  kind: monaco.languages.CompletionItemKind.Field,
                  detail: 'table',
                  sortText: '1' + tb.text,
                })) || [];
            syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getTables(languageId, undefined, undefined, words[0]), createTables);
            existTableCompletions = true;
          }
        } else if (wordCount >= 2 && wordCount <= 3) {
          if (!existDatabaseInCatCompletions && haveCatalog && getDBOrSchema) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await getDBOrSchema(languageId, words[0], words[2]));
            existDatabaseInCatCompletions = true;
          }

          if (!existTableInDbCompletions && callbacks?.getTables) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getTables(languageId, undefined, words[0], words[2]));
            existTableInDbCompletions = true;
          }
        } else if (wordCount >= 4 && wordCount <= 5) {
          if (!existTableInDbCompletions && callbacks?.getTables) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getTables(languageId, words[0], words[2], words[4]));
            existTableInDbCompletions = true;
          }
        }
      }

      if (syntaxContextType === EntityContextType.VIEW) {
        if (wordCount <= 1) {
          if (!existCatalogCompletions && haveCatalog && callbacks?.getCatalogs) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getCatalogs(languageId));
            existCatalogCompletions = true;
          }

          if (!existDatabaseCompletions && getDBOrSchema) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await getDBOrSchema(languageId));
            existDatabaseCompletions = true;
          }

          if (!existViewCompletions && callbacks?.getViews) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getViews(languageId));
            existViewCompletions = true;
          }
        } else if (wordCount >= 2 && wordCount <= 3) {
          if (!existDatabaseInCatCompletions && haveCatalog && getDBOrSchema) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await getDBOrSchema(languageId, words[0], words[2]));
            existDatabaseInCatCompletions = true;
          }

          if (!existViewInDbCompletions && callbacks?.getViews) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getViews(languageId, undefined, words[0]));
            existViewInDbCompletions = true;
          }
        } else if (wordCount >= 4 && wordCount <= 5) {
          if (!existViewInDbCompletions && callbacks?.getViews) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getViews(languageId, words[0], words[2]));
            existViewInDbCompletions = true;
          }
        }
      }

      // if (syntaxContextType === EntityContextType.COLUMN) {
      //   if (wordCount <= 1 && entities && callbacks?.getColumns) {
      //     console.log(entities);
      //     const value = getRangeValue(model, _position.lineNumber);
      //     const [database, tableName] = entities.find(entity => value.includes(entity.text))?.text?.split('.') || [undefined, undefined];
      //     syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getColumns(languageId, undefined, database, tableName, words[0]));
      //   } else if (wordCount >= 2 && wordCount <= 3 && entities && callbacks?.getColumns) {
      //     const [range] = wordRanges;
      //     if (range.text !== '*') {
      //       let table: string | undefined = '';
      //       for (const item of entities) {
      //         if (item.belongStmt.rootStmt) {
      //           const asAliasRegex = new RegExp(`WITH\\s+${words[0]}\\s+AS|AS\\s+${words[0]}`, 'gi');
      //           const rootStmtValue = model?.getValueInRange({
      //             startLineNumber: item.belongStmt.rootStmt?.position.startLine,
      //             startColumn: item.belongStmt.rootStmt?.position.startColumn,
      //             endLineNumber: item.belongStmt.rootStmt?.position.endLine,
      //             endColumn: item.belongStmt.rootStmt?.position.endColumn,
      //           });
      //           if (asAliasRegex.test(rootStmtValue)) {
      //             table = item.text;
      //             break;
      //           }
      //         }
      //       }
      //       if (!table) {
      //         const value = getRangeValue(model, range.line);
      //         table = getTableNameFromAliases(value, range.text);
      //       }
      //       const [database, tableName] = table?.split('.') || [undefined, undefined];
      //       syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getColumns(languageId, undefined, database, tableName, words[2]));
      //     }
      //   }
      // }
      if (syntaxContextType === EntityContextType.COLUMN) {
        const inSelectStmtContext = entities?.some(
          entity => entity.entityContextType === EntityContextType.TABLE && entity.belongStmt.isContainCaret,
        );
        // 上下文中建的所有表
        const allCreateTables =
          (entities?.filter(entity => entity.entityContextType === EntityContextType.TABLE_CREATE) as CommonEntityContext[]) || [];

        if (inSelectStmtContext) {
          // select语句中的来源表
          // todo filter 子查询中的表
          const fromTables =
            entities?.filter(entity => entity.entityContextType === EntityContextType.TABLE && entity.belongStmt.isContainCaret) || [];
          // 从上下文中找到来源表的定义信息
          const fromTableDefinitionEntities = allCreateTables.filter(tb => fromTables?.some(ft => ft.text === tb.text));
          const tableNameAliasMap = fromTableDefinitionEntities.reduce((acc: Record<string, string>, tb) => {
            acc[tb.text] = fromTables?.find(ft => ft.text === tb.text)?.[AttrName.alias]?.text || tb.text;
            return acc;
          }, {});

          console.log('entities', entities);
          console.log('allCreateTables', allCreateTables);
          console.log('fromTables', fromTables);
          console.log('fromTableDefinitionEntities', fromTableDefinitionEntities);
          console.log('tableNameAliasMap', tableNameAliasMap);

          let fromTableColumns: (ICompletionItem & {
            _tableName?: string;
            _columnText?: string;
          })[] = [];

          let syntaxFromTablesColumns: (ICompletionItem & {
            _tableName?: string;
            _columnText?: string;
          })[] = [];

          if (wordCount <= 1) {
            const columnRepeatCountMap = new Map<string, number>();
            fromTableColumns = fromTableDefinitionEntities
              .map(tb => {
                const displayTbName = tableNameAliasMap[tb.text] === tb.text ? tb.text : tableNameAliasMap[tb.text];
                return (
                  tb.columns?.map(column => {
                    const repeatCount = columnRepeatCountMap.get(column.text) || 0;
                    columnRepeatCountMap.set(column.text, repeatCount + 1);
                    return {
                      label: {
                        label: column.text + (column[AttrName.colType]?.text ? `(${column[AttrName.colType].text})` : ''),
                        description: `来源表 ${displayTbName} 的字段`,
                      },
                      insertText: column.text,
                      kind: monaco.languages.CompletionItemKind.EnumMember,
                      detail: `来源表 ${displayTbName} 的字段`,
                      sortText: '0' + displayTbName + column.text + repeatCount,
                      _tableName: displayTbName,
                      _columnText: column.text,
                    };
                  }) || []
                );
              })
              .flat();

            // 如果有多个重名字段，则插入的字段自动包含表名
            fromTableColumns = fromTableColumns.map(column => {
              const columnRepeatCount = columnRepeatCountMap.get(column._columnText as string) || 0;
              const isFromMultipleTables = fromTables.length > 1;
              return columnRepeatCount > 1 && isFromMultipleTables
                ? {
                    ...column,
                    label: `${column._tableName}.${column.label}`,
                    insertText: `${column._tableName}.${column._columnText}`,
                  }
                : column;
            });

            // 输入字段时提供可选表
            const tableOrAliasCompletionItems = fromTables.map(tb => {
              const displayTbName = tableNameAliasMap[tb.text] ? tableNameAliasMap[tb.text] : tb.text;
              return {
                label: displayTbName,
                kind: monaco.languages.CompletionItemKind.Field,
                detail: `table`,
                sortText: '1' + displayTbName,
              };
            });

            for (const table of fromTables) {
              if (callbacks?.getColumns) {
                const tables = table.text.split('.');
                if (tables.length === 2) {
                  syntaxFromTablesColumns = syntaxFromTablesColumns.concat(
                    await callbacks.getColumns(languageId, undefined, tables[0], tables[1], words[0]),
                  );
                } else if (tables.length === 3) {
                  syntaxFromTablesColumns = syntaxFromTablesColumns.concat(
                    await callbacks.getColumns(languageId, tables[0], tables[1], tables[2], words[0]),
                  );
                }
              } else {
                continue;
              }
            }

            syntaxFromTablesColumns = syntaxFromTablesColumns.concat(tableOrAliasCompletionItems);
          } else if (wordCount >= 2 && words[1] === '.') {
            const tbNameOrAlias = words[0];
            fromTableColumns = fromTableDefinitionEntities
              .filter(tb => tb.text === tbNameOrAlias || tableNameAliasMap[tb.text] === tbNameOrAlias)
              .map(tb => {
                const displayTbName = tableNameAliasMap[tb.text] ? tableNameAliasMap[tb.text] : tb.text;
                return (
                  tb.columns?.map(column => ({
                    label: {
                      label: column.text + (column[AttrName.colType]?.text ? `(${column[AttrName.colType].text})` : ''),
                      description: `来源表 ${displayTbName} 的字段`,
                    },
                    insertText: column.text,
                    kind: monaco.languages.CompletionItemKind.EnumMember,
                    detail: `来源表 ${displayTbName} 的字段`,
                    sortText: '0' + displayTbName + column.text,
                  })) || []
                );
              })
              .flat();

            const fromTable = fromTables.find(tb => tb.text === tbNameOrAlias || tb[AttrName.alias]?.text === tbNameOrAlias);
            if (callbacks?.getColumns && fromTable) {
              const tables = fromTable.text.split('.');
              if (tables.length === 2) {
                syntaxFromTablesColumns = syntaxFromTablesColumns.concat(
                  await callbacks.getColumns(languageId, undefined, tables[0], tables[1], words[2]),
                );
              } else if (tables.length === 3) {
                syntaxFromTablesColumns = syntaxFromTablesColumns.concat(
                  await callbacks.getColumns(languageId, tables[0], tables[1], tables[2], words[2]),
                );
              }
            } else {
              continue;
            }
          }

          syntaxCompletionItems = syntaxCompletionItems.concat(syntaxFromTablesColumns, fromTableColumns);
        } else {
          const beforeKeyword = getRangeValue(model, _position.lineNumber)?.split('\r\n').at(-1);
          if (
            beforeKeyword &&
            beforeKeyword
              .toUpperCase()
              ?.replace(/[\r\n]/g, '')
              ?.replace(/[\s\t]+/g, '') === 'SELECT'
          ) {
            const allTableColumns = [
              {
                label: { label: '*', description: '值' },
                insertText: '*' + ' ',
                kind: monaco.languages.CompletionItemKind.Field,
                detail: `值`,
                sortText: '0' + '*',
              },
            ];
            syntaxCompletionItems = syntaxCompletionItems.concat(allTableColumns);
          }
        }
      }

      if (syntaxContextType === EntityContextType.FUNCTION) {
        if (wordCount <= 1) {
          if (!existTableInDbCompletions && editorConfig?.functionCompletion && callbacks?.getFunctions) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getFunctions(languageId));
            existTableInDbCompletions = true;
          }
        } else if (wordCount >= 4 && wordCount <= 5) {
          if (!existTableInDbCompletions && callbacks?.getTables) {
            syntaxCompletionItems = syntaxCompletionItems.concat(await callbacks.getTables(languageId, words[0], words[2], words[4]));
            existTableInDbCompletions = true;
          }
        }
      }
    }

    const customCompletionItems = [...snippetsCompletionItems, ...syntaxCompletionItems];
    return [...customCompletionItems, ...keywordsCompletionItems];
  };

  return completionService;
};
