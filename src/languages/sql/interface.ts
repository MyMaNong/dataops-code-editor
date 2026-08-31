import * as monaco from 'monaco-editor';
import type { ICompletionItem, CompletionOptions, FeatureConfiguration, EntityContextType, EntityContext } from 'monaco-sql-languages';

export type IRange = { range: monaco.IRange | null; position: monaco.IPosition | null };

export interface IOverlayWidgetFeature {
  editor: monaco.editor.IStandaloneCodeEditor;
  getDomNode: () => HTMLElement;
  onRangeChange?: (params: IRange) => void;
}

export interface IEditorConfig {
  functionCompletion?: boolean; // 是否开始函数提示
  keywordCompletion?: boolean; // 是否开启关键字提示
  sqlCodeSnippet?: boolean; // 是否开启SQL代码片段
  sqlCodeSnippetTemplate?: string; // SQL代码片段
  diagnostics?: boolean; // 是否开启SQL语法校验
}

export type CompletionCallbacksReturn = ICompletionItem[] | Promise<ICompletionItem[]>;
export type HoverCallbacksReturn = monaco.languages.ProviderResult<monaco.languages.Hover>;

export type GetCatalogs<T> = (languageId: string, catalog?: string) => T;
export type GetColumns<T> = (languageId: string, catalog?: string, database?: string, tableName?: string, columnName?: string) => T;
export type GetDataBases<T> = (languageId: string, catalog?: string, database?: string) => T;
export type GetFunctions<T> = (languageId: string, functionName?: string) => T;
export type GetSchemas<T> = (languageId: string, catalog?: string, schema?: string) => T;
export type GetTables<T> = (languageId: string, catalog?: string, database?: string, tableName?: string) => T;
export type GetViews<T> = (languageId: string, catalog?: string, database?: string) => T;

export interface ICompletionCallbacks<T = CompletionCallbacksReturn> {
  getCatalogs?: GetCatalogs<T>;
  getColumns?: GetColumns<T>;
  getDataBases?: GetDataBases<T>;
  getFunctions?: GetFunctions<T>;
  getSchemas?: GetSchemas<T>;
  getTables?: GetTables<T>;
  getViews?: GetViews<T>;
}

export interface IHoverMouseOver {
  languageId: string;
  syntaxContextType?: EntityContextType.FUNCTION | EntityContextType.TABLE | EntityContextType.COLUMN;
  position: monaco.Position;
  catalog?: string;
  database?: string;
  tableName?: string;
  columnName?: string;
  functionName?: string;
  entity?: EntityContext;
}

export interface ILanguageSqlSetup<T extends IEditorConfig> {
  editor: monaco.editor.IStandaloneCodeEditor;
  editorConfig?: T;
  languageConfig?: {
    triggerCharacters?: CompletionOptions['triggerCharacters'];
    diagnostics?: FeatureConfiguration['diagnostics'];
  };
}
