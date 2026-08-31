import * as monaco from 'monaco-editor';
import { debounce } from '../../../utils';
import type { IOverlayWidgetFeature } from '../interface';
import { getSQLRangeAtPosition } from '../utils';

let disposerMap: { [key: string]: monaco.IDisposable | null } = {};
let overlayWidgetMap: { [key: string]: monaco.editor.IOverlayWidget } = {};
let codeLensDecorationsMap: { [key: string]: monaco.editor.IEditorDecorationsCollection } = {};

export const setupSqlOverlayWidgetFeature = (params: IOverlayWidgetFeature) => {
  const { editor, getDomNode, onRangeChange } = params;

  const id = editor.getId();
  const widgetId = `${id}-quick-operation-overlay-widget`;
  const codeLensId = `${id}-quick-operation-code-lens`;

  let initViewTop: number | undefined = undefined;
  let scrollTop: number = 0;
  let range: monaco.IRange | null = null;

  const overlayDomNode = document.createElement('div');

  overlayDomNode.style.width = `${editor.getLayoutInfo().lineNumbersWidth + 7}px`;

  for (const key in disposerMap) {
    if (Object.prototype.hasOwnProperty.call(disposerMap, key) && key.includes(id)) {
      const element = disposerMap[key];
      element?.dispose();
      disposerMap[key] = null;
    }
  }

  for (const key in overlayWidgetMap) {
    if (Object.prototype.hasOwnProperty.call(overlayWidgetMap, key) && key.includes(id)) {
      const overlayWidget = overlayWidgetMap[key];
      editor.removeOverlayWidget(overlayWidget);
      delete overlayWidgetMap[key];
    }
  }

  for (const key in codeLensDecorationsMap) {
    if (Object.prototype.hasOwnProperty.call(codeLensDecorationsMap, key) && key.includes(id)) {
      const codeLensDecorations = codeLensDecorationsMap[key];
      codeLensDecorations?.clear();
      delete codeLensDecorationsMap[key];
    }
  }

  const layoutQuickOperationOverlayWidget = (display?: 'block' | 'none') => {
    if (initViewTop !== undefined) {
      overlayDomNode.style.display = display || overlayDomNode.style.display;
      overlayDomNode.style.left = `0px`;
      overlayDomNode.style.top = `${initViewTop - scrollTop}px`;
    }
  };

  const debounceLayoutQuickOperationOverlayWidget = debounce(layoutQuickOperationOverlayWidget, 300);

  const handleCreateCodeLensDecorations = () => {
    if (range) {
      codeLensDecorationsMap[codeLensId]?.clear();
      codeLensDecorationsMap[codeLensId] = editor.createDecorationsCollection([
        {
          range,
          options: {
            linesDecorationsClassName: 'cldr code-lens-decoration',
          },
        },
      ]);
    }
  };

  const handleUpdateInitViewTop = (lineNumber: number) => {
    const lineTop = editor.getTopForLineNumber(lineNumber, true);
    if (lineTop > 0) {
      // const heightDifference = 24 - lineTop / (lineNumber - 1);
      // initViewTop = lineTop - heightDifference / 2;
      initViewTop = lineTop;
    } else {
      initViewTop = 0;
    }
  };

  overlayWidgetMap[widgetId] = {
    getId: () => widgetId,
    getPosition: () => {
      return null;
    },
    getDomNode: () => {
      overlayDomNode.style.display = 'none';
      overlayDomNode.style.textAlign = 'right';
      overlayDomNode.appendChild(getDomNode());
      return overlayDomNode;
    },
  };

  overlayWidgetMap[widgetId] && editor.addOverlayWidget(overlayWidgetMap[widgetId]);

  disposerMap[`${id}-cursor-selection`] = editor.onDidChangeCursorSelection(({ selection }) => {
    const model = editor.getModel();
    const {
      startLineNumber,
      startColumn,
      endLineNumber,
      endColumn,
      selectionStartLineNumber,
      positionLineNumber,
      selectionStartColumn,
      positionColumn,
    } = selection;
    const value = model?.getValueInRange(new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn))?.replace(/\s+/g, '');
    const position: monaco.IPosition | null = { lineNumber: positionLineNumber, column: positionColumn };
    if ((selectionStartLineNumber !== positionLineNumber || selectionStartColumn !== positionColumn) && !!value) {
      range = new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn);
      onRangeChange?.({ range, position });
      handleUpdateInitViewTop(startLineNumber);
      debounceLayoutQuickOperationOverlayWidget('block');
      handleCreateCodeLensDecorations();
    } else {
      range = getSQLRangeAtPosition(editor, startLineNumber);
      onRangeChange?.({ range, position });
      if (range) {
        handleUpdateInitViewTop(startLineNumber);
        layoutQuickOperationOverlayWidget('block');
        handleCreateCodeLensDecorations();
      } else {
        layoutQuickOperationOverlayWidget('none');
        codeLensDecorationsMap[codeLensId]?.clear();
      }
    }
  });

  disposerMap[`${id}-did-scroll`] = editor.onDidScrollChange(e => {
    scrollTop = e.scrollTop;
    debounceLayoutQuickOperationOverlayWidget();
  });
};
