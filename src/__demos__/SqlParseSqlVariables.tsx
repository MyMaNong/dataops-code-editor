import { useEffect, useRef, useState } from 'react';
import { setupCodeEditor, parseSqlVariables } from '@dataops/code-editor';

const Demo = () => {
  const editorRef = useRef<any>(null);
  const [variables, setVariables] = useState<any>([]);

  useEffect(() => {
    const initValue = '-- 注释里的变量 ${ignored1}\nSELECT * FROM t WHERE id = ${userId} AND name = "${varInString}"\n/* 块注释 ${ignored2} */';
    const editor = setupCodeEditor(editorRef.current, {
      value: initValue,
      language: 'sql',
      theme: 'sql-light',
      onDidChangeModelContent: () => {
        const sql = editor.getValue();
        const variables = parseSqlVariables(sql);
        setVariables(variables);
      },
    });

    const variables = parseSqlVariables(initValue);
    setVariables(variables);

    return () => {
      editor?.dispose();
    };
  }, []);

  return (
    <>
      <div ref={editorRef} style={{ width: '100%', height: '220px' }} />
      <div>{JSON.stringify(variables)}</div>
    </>
  );
};

export default Demo;
