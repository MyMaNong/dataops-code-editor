import { LanguageIdEnum } from 'monaco-sql-languages/esm/common/constants.js';
import type { EditorConfigFieldType } from '../SqlConfig';

export const defaultEditorSettingsParams: EditorConfigFieldType = {
  lineNumbers: true,
  folding: true,
  wordWrap: false,
  functionCompletion: true,
  tabSize: 2,
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 13,
  theme: 'sql-light',
  sqlCodeSnippet: false,
  sqlCodeSnippetTemplate: `sf=select * from\nscf=select count(1) from`,
  diagnostics: false,
  keywordCompletion: true,
  language: LanguageIdEnum.SPARK,
};

export const fontFamilyOptions = [
  {
    label: '默认字体',
    value: 'Consolas, "Courier New", monospace',
  },
  {
    label: 'Source Code Pro',
    value: 'Source Code Pro, "Courier New", monospace',
  },
  {
    label: 'Constantia',
    value: 'Constantia, "Courier New", monospace',
  },
  {
    label: 'Corbel',
    value: 'Corbel, "Courier New", monospace',
  },
  {
    label: 'Ebrima',
    value: 'Ebrima, "Courier New", monospace',
  },
];

export const fontSizeOptions = Array.from({ length: 21 }, (_, index) => index + 10).map(value => ({
  label: `${value}px`,
  value,
}));

export const themeOptions = [
  {
    label: 'Light',
    value: 'sql-light',
  },
  {
    label: 'Dark',
    value: 'sql-dark',
  },
  {
    label: 'Hc',
    value: 'sql-hc',
  },
  {
    label: 'Classic',
    value: 'sql-classic',
  },
  {
    label: 'Slate',
    value: 'sql-slate',
  },
];

export const languageOptions = [
  {
    label: LanguageIdEnum.MYSQL,
    value: LanguageIdEnum.MYSQL,
  },
  {
    label: LanguageIdEnum.SPARK,
    value: LanguageIdEnum.SPARK,
  },
];
