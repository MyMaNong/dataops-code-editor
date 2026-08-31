import { useEffect, useRef } from 'react';
import { setupCodeEditor, setupBracketSelectFeature } from '@dataops/code-editor';

const Demo = () => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const editor = setupCodeEditor(editorRef.current, {
      value: '(我是括号内的内容，双击左右括号可选中)\n\n{我是括号内的内容，双击左右括号可选中}\n\n[我是括号内的内容，双击左右括号可选中]',
    });

    setupBracketSelectFeature(editor);

    return () => {
      editor?.dispose();
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px' }} />;
};

export default Demo;
