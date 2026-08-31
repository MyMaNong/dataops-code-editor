import * as monaco from 'monaco-editor';
import type { ISetupCodeEditorOptions, ISetupDiffCodeEditorOptions, IModelValue } from './interface';

import { setupWorker } from './worker';

setupWorker();

const setupCodeEditor = (domElement: HTMLElement, options?: ISetupCodeEditorOptions) => {
  const opts = options || {};
  const editor = monaco.editor.create(domElement, {
    automaticLayout: true,
    useShadowDOM: true,
    cursorSmoothCaretAnimation: 'off',
    fixedOverflowWidgets: true,
    fontLigatures: '',
    minimap: {
      enabled: false, // 是否启用预览图
    },
    detectIndentation: false,
    lineNumbers: 'on',
    wordWrap: 'off',
    tabSize: 2,
    ...opts,
  });

  editor.onDidChangeCursorSelection(e => {
    opts?.onDidChangeCursorSelection?.(e);
  });

  editor.onDidChangeModelContent(e => {
    opts?.onDidChangeModelContent?.(e);
  });

  editor.onDidFocusEditorText(() => {
    opts?.onDidFocusEditorText?.();
  });

  // FIX：拖拽文本会在文本末尾添加$0符号
  editor.getContainerDomNode().addEventListener('drop', e => {
    e.preventDefault();
    const data = e.dataTransfer?.getData('text/plain');
    const position = editor.getTargetAtClientPoint(e.clientX, e.clientY);
    if (position?.range && data) {
      editor.executeEdits('drop', [
        {
          range: position.range,
          text: data,
          forceMoveMarkers: true,
        },
      ]);
    }
  });

  return editor;
};

const setupDiffCodeEditor = (domElement: HTMLElement, modelValue: IModelValue, options?: ISetupDiffCodeEditorOptions) => {
  const opts = options || {};

  const diffEditor = monaco.editor.createDiffEditor(domElement, {
    // You can optionally disable the resizing
    enableSplitViewResizing: false,
    ...opts,
  });

  const originalModel = monaco.editor.createModel(modelValue.oldValue, options?.language);

  const modifiedModel = monaco.editor.createModel(modelValue.newValue, options?.language);

  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel,
  });

  return diffEditor;
};

export * from './languages';
export * from './features';
export * from './utils';
export * from './constants';

export type * from './interface';

export { setupCodeEditor, setupDiffCodeEditor };
