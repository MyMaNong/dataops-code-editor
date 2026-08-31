import { useEffect, useRef } from 'react';
import { setupCodeEditor } from '@dataops/code-editor';

const Demo = () => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const editor = setupCodeEditor(editorRef.current);

    return () => {
      editor?.dispose();
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px' }} />;
};

export default Demo;
