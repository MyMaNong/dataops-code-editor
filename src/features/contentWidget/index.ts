import * as monaco from 'monaco-editor';
import type { IContentWidgetFeature } from './interface';

export const setupContentWidgetFeature = (params: IContentWidgetFeature) => {
  const { id, editor, position, getDomNode, ...args } = params;

  let newContentWidget: monaco.editor.IContentWidget;

  const addContentWidget = () => {
    if (getDomNode) {
      newContentWidget = {
        allowEditorOverflow: false, // 允许内容溢出
        suppressMouseDown: false, // 阻止鼠标事件
        getId: () => id,
        getPosition: () => {
          return {
            position,
            preference: [monaco.editor.ContentWidgetPositionPreference.BELOW],
          };
        },
        getDomNode,
        ...args,
      };

      editor.addContentWidget(newContentWidget);
    }
  };

  addContentWidget();

  return {
    dispose: () => {
      editor.removeContentWidget(newContentWidget);
    },
  };
};

export type * from './interface';
