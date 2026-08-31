import * as monaco from 'monaco-editor';

export const setupContextMenuFeature = (editor: monaco.editor.IStandaloneCodeEditor, actions: monaco.editor.IActionDescriptor[]) => {
  for (const action of actions) {
    editor.addAction({
      ...action,
    });
  }
};
