import { useEffect, useRef } from 'react';
import { setupCodeEditor, PlaceholderContentWidget } from '@dataops/code-editor';

const Demo = () => {
  const editorRef = useRef<any>();

  useEffect(() => {
    const editor = setupCodeEditor(editorRef.current);

    new PlaceholderContentWidget('占位符使用', editor);

    return () => {
      editor?.dispose();
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px' }} />;
};

export default Demo;
