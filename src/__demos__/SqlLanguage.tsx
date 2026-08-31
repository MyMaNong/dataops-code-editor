import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { setupCodeEditor, PlaceholderContentWidget, setupSqlLanguageFeature, LanguageIdEnum } from '@dataops/code-editor';

const catalogList = ['mock_catalog_1', 'mock_catalog_2', 'mock_catalog_3'];
const schemaList = ['mock_schema_1', 'mock_schema_2', 'mock_schema_3'];
const databaseList = ['mock_database_1', 'mock_database_2', 'mock_database_3'];
const tableList = ['mock_table1', 'mock_table2', 'mock_table3'];
const viewList = ['mock_view1', 'mock_view2', 'mock_view3'];
const columnList = ['mock_column1', 'mock_column2', 'mock_column3'];
const functionList = ['mock_function1', 'mock_function2', 'mock_function3'];

const tmpDatabaseList = ['current_catalog_db1', 'current_catalog_db2', 'current_catalog_db3'];
const tmpSchemaList = ['current_catalog_schema1', 'current_catalog_schema2', 'current_catalog_schema3'];
const tmpTableList = ['current_db_table1', 'current_db_table2', 'current_db_table3'];
const tmpViewList = ['current_db_view1', 'current_db_view2', 'current_db_view3'];

const debounce = (func, wait) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
};

const Demo = () => {
  const editorRef = useRef<any>();

  const onDidChangeModelContent = debounce(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      const model = editor.getModel(); // 获取编辑器实例或传入参数
      const position = editor.getPosition(); // 获取当前光标位置
      if (position?.lineNumber) {
        // 获取当前行内容
        const currentLineContent = model?.getLineContent(position?.lineNumber);
        if (currentLineContent && [' ', '.'].includes(currentLineContent.at(-1) || '')) {
          console.log(editor?.['_actions']);
          editor.trigger('manual', 'editor.action.triggerSuggest', {});
        }
      }
    },
    300
  );

  useEffect(() => {
    const editor = setupCodeEditor(editorRef.current, {
      value: 'SELECT mock_column1, mock_column2 FROM current_catalog_db1.current_db_table1 LIMIT 100;',
      language: LanguageIdEnum.HIVE,
      theme: 'sql-light',
      wordBasedSuggestions: 'off',
      onDidChangeModelContent: () => onDidChangeModelContent(editor),
    });

    new PlaceholderContentWidget(
      // eslint-disable-next-line max-len
      'SELECT mock_column1, mock_column2 FROM current_catalog_db1.current_db_table1 LIMIT 100;',
      editor,
    );

    setupSqlLanguageFeature(
      {
        editor,
        editorConfig: {
          functionCompletion: true,
          keywordCompletion: true,
        },
      },
      {
        getCatalogs: async languageId => {
          return Promise.resolve(
            catalogList.map(label => ({
              label,
              kind: monaco.languages.CompletionItemKind.Folder,
              detail: 'catalog',
              sortText: '1' + label,
              insertText: label + '.',
            })),
          );
        },
        getColumns: async (languageId, catalog, database, tableName, columnName) => {
          console.log({ catalog, database, tableName, columnName });
          return Promise.resolve(
            columnList.map(label => ({
              label,
              kind: monaco.languages.CompletionItemKind.Field,
              detail: 'column',
              sortText: '1' + label,
            })),
          );
        },
        getDataBases: async (languageId, catalog) => {
          console.log({ catalog });
          const databases = catalog ? databaseList : tmpDatabaseList;

          const databaseCompletions = databases.map(label => ({
            label,
            kind: monaco.languages.CompletionItemKind.File,
            detail: 'database',
            sortText: '1' + label,
            insertText: label + '.',
          }));

          return Promise.resolve(databaseCompletions);
        },
        getFunctions: async languageId => {
          return Promise.resolve(
            functionList.map(label => ({
              label,
              kind: monaco.languages.CompletionItemKind.Function,
              detail: 'function',
              sortText: '1' + label,
              insertText: `${label}($1)`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            })),
          );
        },
        getSchemas: async (languageId, catalog, schema) => {
          console.log({ catalog, schema });

          const schemas = catalog ? schemaList : tmpSchemaList;

          const schemaCompletions = schemas.map(label => ({
            label,
            kind: monaco.languages.CompletionItemKind.File,
            detail: 'schema',
            sortText: '1' + label,
            insertText: label + '.',
          }));

          return Promise.resolve(schemaCompletions);
        },
        getTables: async (languageId, catalog, database, tableName) => {
          console.log({ catalog, database, tableName });
          const tables = catalog && database ? tableList : tmpTableList;

          const tableCompletions = tables.map(label => ({
            label,
            kind: monaco.languages.CompletionItemKind.Class,
            detail: 'table',
            sortText: '1' + label,
            insertText: label + ' ',
          }));

          return Promise.resolve(tableCompletions);
        },
        getViews: async (languageId, catalog, database) => {
          console.log({ catalog, database });
          const views = catalog && database ? viewList : tmpViewList;

          const viewCompletions = views.map(label => ({
            label,
            kind: monaco.languages.CompletionItemKind.Interface,
            detail: 'view',
            sortText: '1' + label,
            insertText: label + '.',
          }));

          return Promise.resolve(viewCompletions);
        },
      },
    );

    return () => {
      editor?.dispose();
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px' }} />;
};

export default Demo;
