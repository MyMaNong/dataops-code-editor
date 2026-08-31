import * as monaco from 'monaco-editor';

export interface ILanguagesLogViewerSetup {
  editor: monaco.editor.IStandaloneCodeEditor;
  autoScrollToBottom?: boolean;
  monarch?: monaco.languages.IMonarchLanguage;
}
