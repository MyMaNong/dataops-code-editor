import * as monaco from 'monaco-editor';

export interface ISignatureInfo extends monaco.languages.SignatureInformation {
  name: string;
}

export interface ISignatureHelpOptions {
  signatures: ISignatureInfo[];
}
