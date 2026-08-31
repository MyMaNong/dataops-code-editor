import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { setupCodeEditor, setupViewZoneFeature } from '@dataops/code-editor';
import { Space, Input, Button } from '@douyinfe/semi-ui';

const Demo = () => {
  const editorRef = useRef<any>(null);
  const viewZoneRef = useRef<any>(null);

  const handleDispose = () => {
    viewZoneRef.current?.dispose();
  };

  useEffect(() => {
    const editor = setupCodeEditor(editorRef.current, {
      language: 'sql',
      value: `SELECT \n mock_column1, \n mock_column2 \n FROM current_catalog_db1.current_db_table1 \n LIMIT 100;`,
    });

    viewZoneRef.current = setupViewZoneFeature({
      editor,
      getDomNode: () => {
        const div = document.createElement('div');
        div.style.zIndex = '1';
        const root = createRoot(div);
        root.render(
          <div style={{ padding: 8, boxShadow: ' 0 2px 8px 0 rgba(0, 0, 0, 0.15)' }}>
            <Space style={{ width: 300 }}>
              <Input defaultValue="test-content" />
              <Button type="primary" onClick={handleDispose}>
                点击关闭
              </Button>
            </Space>
          </div>,
        );
        return div;
      },
      position: { lineNumber: 1, column: 0 },
      heightInPx: 100,
    });

    return () => {
      editor?.dispose();
      handleDispose();
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px ' }} />;
};

export default Demo;
