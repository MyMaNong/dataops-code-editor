import { useEffect, useRef } from 'react';
import { setupCodeEditor, PlaceholderContentWidget, setupPythonLanguageFeature } from '@dataops/code-editor';

const Demo = () => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const editor = setupCodeEditor(editorRef.current, {
      language: 'python',
    });

    new PlaceholderContentWidget(
      // eslint-disable-next-line max-len
      'Python编辑器',
      editor,
    );

    setupPythonLanguageFeature({ editor });

    return () => {
      editor?.dispose();
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px' }} />;
};

export default Demo;
