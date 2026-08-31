import { useEffect, useRef } from 'react';
import {
  setupCodeEditor,
  setupLogViewerLanguageFeature,
  setupLogViewerDefineTheme,
  onEditorInsertAnsiText,
  LanguageIdMap,
} from '@dataops/code-editor';

setupLogViewerDefineTheme();

const Demo = () => {
  const editorRef = useRef<any>(null);

  const value = `------------ANSI转义序列日志示例------------`;

  useEffect(() => {
    const editor = setupCodeEditor(editorRef.current, {
      language: LanguageIdMap.LOG_VIEWER,
      theme: 'log-theme-light',
      readOnly: true,
      minimap: {
        enabled: true,
      },
      wordWrap: 'on',
      scrollBeyondLastLine: false,
      lineNumbers: 'off',
      glyphMargin: false,
      folding: false,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 10,
      padding: { top: 10, bottom: 10 },
    });

    const timer = setInterval(() => {
      const oldValue = editor.getValue();
      const randomValue = Math.random();
      const ansiValue = `\x1B[${30 + Math.floor(7 * randomValue)}m${randomValue}\x1b[0m`;
      console.log(ansiValue);
      const newLog = `2025-12-12 ${new Date().toLocaleTimeString()} stderr F ${ansiValue}`;
      const newValue = oldValue ? `\n${newLog}` : value;
      onEditorInsertAnsiText(editor, newValue);
    }, 2000);

    setupLogViewerLanguageFeature({ editor, autoScrollToBottom: true });

    return () => {
      editor?.dispose();
      clearInterval(timer);
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px' }} />;
};

export default Demo;
