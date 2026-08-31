import * as monaco from 'monaco-editor';
import type { ILanguagesLogViewerSetup } from './interface';
import { setupLogViewerMonarchTokensProvider } from './helpers';
import { scrollToBottom } from './utils';
import { LanguageIdMap } from '../../constants';

export const setupLogViewerLanguageFeature = (params: ILanguagesLogViewerSetup) => {
  const { editor, autoScrollToBottom, monarch } = params;

  let isScrolledToBottom = true;
  let prevScrollHeight = 0;

  // 注册日志语言
  monaco.languages.register({ id: LanguageIdMap.LOG_VIEWER });

  editor.onDidScrollChange(e => {
    if (autoScrollToBottom) {
      const currentScrollTop = editor.getScrollTop();
      const layoutInfoHeight = editor.getLayoutInfo().height;
      const maxScrollTop = prevScrollHeight - layoutInfoHeight;
      const threshold = 10;

      isScrolledToBottom = currentScrollTop >= maxScrollTop - threshold;

      const scrollHeight = editor.getScrollHeight();
      prevScrollHeight = scrollHeight;
    }
  });

  editor.onDidChangeModelContent(() => {
    if (autoScrollToBottom && isScrolledToBottom) {
      scrollToBottom(editor);
    }
  });

  setupLogViewerMonarchTokensProvider(monarch);
};

export * from './helpers';
export * from './utils';

export type * from './interface';
