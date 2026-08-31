import type { ILanguagesPythonSetup } from './interface';
import { setupPythonCompletionItemProvider } from './helpers/completionItemProvider';

export const setupPythonLanguageFeature = (params: ILanguagesPythonSetup) => {
  const { editor } = params;

  setupPythonCompletionItemProvider(editor);
};

export * from './helpers';

export type * from './interface';
