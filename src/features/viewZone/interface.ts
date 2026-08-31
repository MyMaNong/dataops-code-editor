import * as monaco from 'monaco-editor';

export interface IViewZoneFeature extends Partial<monaco.editor.IViewZone> {
  editor: monaco.editor.IStandaloneCodeEditor;
  width?: number | string;
  zIndex?: string;
  position: monaco.IPosition;
  getDomNode: () => HTMLElement;
}
