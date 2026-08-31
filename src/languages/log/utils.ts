import * as monaco from 'monaco-editor';

export const scrollToBottom = (editor: monaco.editor.IStandaloneCodeEditor) => {
  const lastLineNumber = editor?.getModel()?.getLineCount();
  lastLineNumber && editor.revealLine(lastLineNumber);
};

export const scrollToTop = (editor: monaco.editor.IStandaloneCodeEditor) => {
  editor.revealLine(1);
};

/**
 * 高亮关键词
 * @param editor
 * @param keyword
 * @param className
 */
export const applyCustomHighlight = (editor: monaco.editor.IStandaloneCodeEditor, keyword: string, className: string) => {
  const model = editor.getModel();
  const matches = model?.findMatches(keyword, true, false, false, null, true);

  const decorations = matches?.map(match => ({
    range: match.range,
    options: {
      inlineClassName: className, // 对应CSS类
      stickiness: 1, // 防止被语法高亮覆盖
    },
  }));

  // 动态添加装饰器
  editor?.createDecorationsCollection(decorations);
};

/**
 * 下载日志
 */
export const saveTextAsFile = (textToWrite: string, fileName: string) => {
  // 提供文本和文件类型用于创建一个Blob对象
  const blob = new Blob([textToWrite]);
  // 创建一个 a 元素
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  // 无感触发下载
  link.click();
};
