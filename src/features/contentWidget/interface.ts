import * as monaco from 'monaco-editor';

export interface IContentWidgetFeature extends Partial<monaco.editor.IContentWidget> {
  id: string;
  editor: monaco.editor.IStandaloneCodeEditor;
  position: monaco.IPosition;
}
