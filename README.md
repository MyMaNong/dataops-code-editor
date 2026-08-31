# @dataops/code-editor

大数据平台代码编辑器，不限框架，支持Sql、Python编辑，日志预览等功能，集成相关功能仅需调用相关方法即可！

See the demo on the github at https://mymanong.github.io/dataops-code-editor

[**[Demo](https://mymanong.github.io/dataops-code-editor)**]

## Features

- **[Sql编辑器](https://mymanong.github.io/dataops-code-editor/sql/language)**
- **[Python编辑器](https://mymanong.github.io/dataops-code-editor/python/language)**
- **[日志预览](https://mymanong.github.io/dataops-code-editor/log/basis)**

## Usage

Install:

```bash
yarn add @dataops/code-editor
```

React:

```tsx
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
```
