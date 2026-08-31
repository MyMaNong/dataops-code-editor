import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as monaco from 'monaco-editor';
import { setupCodeEditor, PlaceholderContentWidget, setupSqlOverlayWidgetFeature } from 'dataops-code-editor';
import type { IRange } from 'dataops-code-editor';

const QuickOperation= props => {
  return (
    <button className='quick-operation-button' onMouseMove={props.onMouseMove} onMouseLeave={props.onMouseLeave} onClick={props.onClick}>
      执行
    </button>
  );
};


let range: monaco.IRange | null = null;
let position: monaco.IPosition | null = null;
let contentDecorations: monaco.editor.IEditorDecorationsCollection | null = null;

const Demo = () => {
  const editorRef = useRef<any>(null);

  const handleMouseMove = (editor: monaco.editor.IStandaloneCodeEditor) => {
    if (range && !contentDecorations) {
      contentDecorations = editor.createDecorationsCollection([
        {
          range,
          options: {
            className: 'select-content-decoration',
          },
        },
      ]);
    }
  };

  const handleMouseLeave = () => {
    contentDecorations?.clear();
    contentDecorations = null;
  };

  const handleClick = () => {
    alert('click');
  };

  const onRangeChange = (params: IRange) => {
    range = params.range;
    position = params.position;
  };

  useEffect(() => {
    const editor = setupCodeEditor(editorRef.current, {
      language: 'sql',
      value: `SELECT \n mock_column1, \n mock_column2 \n FROM current_catalog_db1.current_db_table1 \n LIMIT 100;`,
      wordWrap: 'on',
    });

    new PlaceholderContentWidget(
      // eslint-disable-next-line max-len
      'OverlayWidget小部件',
      editor,
    );

    setupSqlOverlayWidgetFeature({
      editor,
      getDomNode: () => {
        const div = document.createElement('div');
        const root = createRoot(div);
        root.render(
          <QuickOperation
            onMouseMove={() => handleMouseMove(editor)}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          />,
        );
        return div;
      },
      onRangeChange,
    });

    return () => {
      editor?.dispose();
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px ' }} />;
};

export default Demo;
