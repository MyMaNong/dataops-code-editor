import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as monaco from 'monaco-editor';
import {
  setupCodeEditor,
  PlaceholderContentWidget,
  setupSqlHoverFeature,
  setupSqlLanguageFeature,
  setupContentWidgetFeature,
  LanguageIdEnum,
  EntityContextType,
} from '@dataops/code-editor';

import { Table, Typography, Button } from '@douyinfe/semi-ui';

interface TableHoverProps {
  catalog?: string;
  database?: string;
  tableName?: string;
}

const TableHover: React.FC<TableHoverProps> = props => {
  const { catalog, database, tableName } = props;

  const columns = [
    {
      title: '列名',
      dataIndex: 'columnName',
      key: 'columnName',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'dataType',
      key: 'dataType',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '注释',
      dataIndex: 'comment',
    },
  ];

  const dataSource = [
    {
      columnName: 'id',
      dataType: 'int',
      comment: 'id',
    },
    {
      columnName: 'name',
      dataType: 'string',
      comment: 'name',
    },
    {
      columnName: 'age',
      dataType: 'int',
      comment: 'age',
    },
    {
      columnName: 'sex',
      dataType: 'int',
      comment: 'sex',
    },
  ];

  return (
    <>
      <Typography>库表名：{catalog ? `${catalog}.${database}.${tableName}` : `${database}.${tableName}`}</Typography>
      <Table rowSelection={{ selectedRowKeys: [] }} columns={columns} dataSource={dataSource} pagination={false} size="small" />
      <div style={{ marginTop: 8 }}>
        <Button type="primary" size="small">
          复制字段名
        </Button>
      </div>
    </>
  );
};

const Demo = () => {
  const editorRef = useRef<any>();
  const widgetRef = useRef<any>();
  const collectionRef = useRef<any>();
  const hoverTableName = useRef('');

  const createContentWidget = (
    editor: monaco.editor.IStandaloneCodeEditor,
    position: monaco.Position,
    params?: {
      catalog?: string;
      database?: string;
      tableName?: string;
    },
  ) => {
    if (!widgetRef.current) {
      widgetRef.current = setupContentWidgetFeature({
        id: 'test-content',
        editor,
        getDomNode: () => {
          const div = document.createElement('div');
          const root = createRoot(div);
          root.render(
            <div style={{ width: 400, padding: 8, boxShadow: ' 0 2px 8px 0 rgba(0, 0, 0, 0.15)', backgroundColor: 'white' }}>
              <TableHover {...params} />
            </div>,
          );
          return div;
        },
        position,
      });
    }
  };

  const createCodeLensDecorations = (editor: monaco.editor.IStandaloneCodeEditor, range: monaco.IRange | null) => {
    if (range) {
      collectionRef.current = editor.createDecorationsCollection([
        {
          range,
          options: {
            className: 'hover-content-decoration',
          },
        },
      ]);
    }
  };

  const disposeContentWidget = () => {
    widgetRef.current?.dispose();
    widgetRef.current = null;
    collectionRef.current?.clear();
    collectionRef.current = null;
    hoverTableName.current = '';
  };

  useEffect(() => {
    const editor = setupCodeEditor(editorRef.current, {
      value: 'select function1("a"), column1 from my_database.my_table limit 1000;',
      language: LanguageIdEnum.HIVE,
      theme: 'sql-light',
      hover: {
        delay: 1000,
      },
    });

    new PlaceholderContentWidget(
      // eslint-disable-next-line max-len
      '鼠标Hover展示信息',
      editor,
    );

    setupSqlLanguageFeature({
      editor,
      editorConfig: {
        functionCompletion: true,
        keywordCompletion: true,
      },
    });

    setupSqlHoverFeature(editor, {
      onMouseOver: params => {
        const { syntaxContextType, catalog, database, tableName, entity, position } = params;
        if (syntaxContextType === EntityContextType.TABLE && !!database && !!tableName && !!entity) {
          if (hoverTableName.current !== tableName) {
            disposeContentWidget();
            createContentWidget(
              editor,
              {
                lineNumber: entity.position.line,
                column: entity.position.startColumn,
              } as monaco.Position,
              { catalog, database, tableName },
            );
            const lineNumber = position.lineNumber;
            const entityPosition = params.entity?.position;
            if (entityPosition) {
              const { startColumn, endColumn } = entityPosition;
              const range = new monaco.Range(lineNumber, startColumn, lineNumber, endColumn);
              createCodeLensDecorations(editor, range);
            }
            hoverTableName.current = tableName;
          }
          return Promise.resolve(undefined);
        } else if (syntaxContextType === EntityContextType.FUNCTION) {
          return Promise.resolve({
            contents: [
              {
                value: 'function1',
              },
            ],
          });
        } else {
          disposeContentWidget();
          return Promise.resolve(undefined);
        }
      },
      onMouseOut: () => {
        disposeContentWidget();
      },
    });

    return () => {
      editor?.dispose();
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px' }} />;
};

export default Demo;
