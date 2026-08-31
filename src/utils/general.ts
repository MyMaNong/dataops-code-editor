import * as monaco from 'monaco-editor';

let decorationsCollection: monaco.editor.IEditorDecorationsCollection | null = null;

const onEditorClean = (
  editor: monaco.editor.IStandaloneCodeEditor,
  options: {
    range: monaco.IRange;
  },
) => {
  const { range } = options;
  editor.pushUndoStop();
  editor.executeEdits('value-clean', [{ range, text: '' }]);
};

const onEditorSetValue = (
  editor: monaco.editor.IStandaloneCodeEditor,
  options: {
    range: monaco.IRange;
    value: string;
  },
) => {
  const { value, range } = options;
  editor.pushUndoStop();
  editor.executeEdits('value-update', [{ range, text: value }]);
};

const onEditorUndo = (editor: monaco.editor.IStandaloneCodeEditor) => editor.trigger('owner', 'undo', null);

const onEditorRedo = (editor: monaco.editor.IStandaloneCodeEditor) => editor.trigger('owner', 'redo', null);

const onEditorGetSelectionValue = (
  editor: monaco.editor.IStandaloneCodeEditor,
  options: {
    range?: monaco.IRange;
    notesReg?: string; // 是否携带注释，如果携带请编写正在匹配
  },
) => {
  const { range, notesReg } = options;
  if (range) {
    const { startLineNumber, endLineNumber, startColumn, endColumn } = range;
    const model = editor.getModel();

    const SELECTION_VALUE = model?.getValueInRange({
      startLineNumber,
      startColumn,
      endLineNumber,
      endColumn,
    });

    let value = '';

    if (notesReg) {
      const findMatches = model?.findMatches(
        notesReg,
        new monaco.Range(startLineNumber - 3, startColumn, endLineNumber, endColumn),
        true,
        true,
        null,
        false,
      );

      const NL2SQL_NOTE = findMatches?.[0];

      if (NL2SQL_NOTE && SELECTION_VALUE && !new RegExp(notesReg).test(SELECTION_VALUE)) {
        const note = model?.getValueInRange(NL2SQL_NOTE.range);
        value += `/*\n* ${note}\n*/\n`;
      }
    }

    value += SELECTION_VALUE;

    return value;
  }
  return null;
};

const onEditorSetModelMarkers = (
  editor: monaco.editor.IStandaloneCodeEditor,
  options: {
    range: monaco.IRange;
    message?: string;
    searchString?: string;
  },
) => {
  const model = editor?.getModel();
  const { range, message, searchString } = options;
  decorationsCollection?.clear();
  decorationsCollection = null;
  const onRegisterModelMarkers = (ranges: monaco.IRange[], code?: string) => {
    if (model) {
      monaco.editor.setModelMarkers(
        model,
        'admin',
        message
          ? ranges.map(range => ({
              ...range,
              severity: monaco.MarkerSeverity.Error,
              message,
              code,
            }))
          : [],
      );
    }
    // 设置ERROR图标
    if (message) {
      const decorations = ranges.map(range => ({
        range,
        options: {
          linesDecorationsClassName: 'code-lens-error-decoration',
          hoverMessage: { value: message },
        },
      }));
      decorationsCollection = editor.createDecorationsCollection(decorations);
    }
  };
  if (searchString) {
    try {
      const model = editor.getModel();
      const regSearchString = searchString
        .replace(/^\n+|\n+$/g, '')
        .trim()
        .replace(/[.|*|+|-|?|^|$|{|}|(|)]+/g, match => `\\${match}`)
        .replace(/[\n]+/g, '\\n')
        .replace(/[\s]+/g, `\\s`);

      const findMatchRes = model?.findMatches(regSearchString, true, true, true, null, false) || [];

      if (findMatchRes.length) {
        onRegisterModelMarkers(
          findMatchRes.map(({ range }) => range),
          searchString,
        );
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    onRegisterModelMarkers([range]);
  }
};

const onEditorInsertValue = (editor: monaco.editor.IStandaloneCodeEditor, text: string) => {
  // 添加内容
  const model = editor.getModel();
  const lineCount = model?.getLineCount() || 0;
  const lastLineLength = model?.getLineMaxColumn(lineCount) || 0;

  // 创建编辑操作并附加新内容
  const editOperation = {
    range: new monaco.Range(lineCount, lastLineLength, lineCount, lastLineLength),
    text,
    forceMoveMarkers: true,
  };

  model?.applyEdits([editOperation]);
};

export { onEditorClean, onEditorSetValue, onEditorUndo, onEditorRedo, onEditorGetSelectionValue, onEditorSetModelMarkers, onEditorInsertValue };
