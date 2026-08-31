import * as monaco from 'monaco-editor';
import { language } from 'monaco-editor/esm/vs/basic-languages/python/python.js';

let disposerMap: { [key: string]: monaco.IDisposable | null } = {};

export const setupPythonCompletionItemProvider = (editor: monaco.editor.IStandaloneCodeEditor) => {
  const id = editor.getId();
  for (const key in disposerMap) {
    if (Object.prototype.hasOwnProperty.call(disposerMap, key) && key.includes(id)) {
      const element = disposerMap[key];
      element?.dispose();
      disposerMap[key] = null;
    }
  }
  disposerMap[`${id}_hover`] = monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: async function (model, position) {
      const suggestions = language.keywords.map(label => ({
        label,
        kind: monaco.languages.CompletionItemKind.Keyword,
        detail: '关键字',
        sortText: '1' + label,
        insertText: label,
      }));
      return {
        suggestions,
      };
    },
  });
};
