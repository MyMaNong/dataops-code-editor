import * as monaco from 'monaco-editor';

export interface ISetupCodeEditorOptions extends monaco.editor.IStandaloneEditorConstructionOptions {
  onDidChangeCursorSelection?: (e: monaco.editor.ICursorSelectionChangedEvent) => void;
  onDidChangeModelContent?: (e: monaco.editor.IModelContentChangedEvent) => void;
  onDidFocusEditorText?: () => void;
}

export interface ISetupDiffCodeEditorOptions extends monaco.editor.IStandaloneDiffEditorConstructionOptions {
  language?: string;
}

export interface IModelValue {
  oldValue: string;
  newValue: string;
}
