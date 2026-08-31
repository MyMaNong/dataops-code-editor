import * as monaco from 'monaco-editor';
import type { ISignatureHelpOptions } from './interface';

let disposer: monaco.IDisposable | null = null;

export const setupSignatureHelpFeature = (editor: monaco.editor.IStandaloneCodeEditor, options: ISignatureHelpOptions) => {
  const model = editor.getModel();
  const languageId = model?.getLanguageId();

  disposer?.dispose();

  if (languageId) {
    disposer = monaco.languages.registerSignatureHelpProvider(languageId, {
      signatureHelpTriggerCharacters: ['(', ',', '<'],
      signatureHelpRetriggerCharacters: [')'],
      provideSignatureHelp: (model, position, token, context) => {
        // const word = model.getWordUntilPosition({ ...position, column: position.column - 1 }); // 获取光标前的单词
        // 获取光标前的内容（最多向上50行）
        const lineNumber = position.lineNumber;
        const startLine = Math.max(1, lineNumber - 50);
        const textUntilCursor = model.getValueInRange({
          startLineNumber: startLine,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // 使用正则表达式匹配函数名称，PS: 支持函数跨行
        const functionCallMatch = textUntilCursor.match(/([\w\.]+)\s*\(([\s\S]*?)$/);

        if (!functionCallMatch) return null;

        const functionName = functionCallMatch[1].toUpperCase();
        console.log('functionCallMatch', functionCallMatch);
        console.log('functionName', functionName);

        const functionArgsText = functionCallMatch[2];

        // 计算参数索引，PS: 支持嵌套括号
        let activeParameter = 0;
        let parenDepth = 0;

        for (let i = 0; i < functionArgsText.length; i++) {
          const char = functionArgsText[i];
          if (char === '(') {
            parenDepth++;
          } else if (char === ')') {
            parenDepth = Math.max(0, parenDepth - 1);
            if (parenDepth < 0) break;
          } else if (char === ',' && parenDepth === 0) {
            activeParameter++;
          }
        }

        if (functionName && options) {
          const signatures = options.signatures.filter(signature => signature.name.toUpperCase() === functionName);

          if (signatures.length > 0) {
            return {
              value: {
                signatures,
                activeSignature: 0,
                activeParameter,
              },
              dispose: () => {},
            };
          }
        }

        return null;
      },
    });
  }

  return {
    disposer,
  };
};
