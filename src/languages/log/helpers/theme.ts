import * as monaco from 'monaco-editor';

interface IStandaloneThemeData {
  rules?: monaco.editor.ITokenThemeRule[];
  colors?: monaco.editor.IColors;
}

export interface IDefineThemeParams {
  light?: IStandaloneThemeData;
  dark?: IStandaloneThemeData;
}

export const setupLogViewerDefineTheme = (theme?: IDefineThemeParams) => {
  const { dark = {}, light = {} } = theme || {};
  const lightRules = light.rules || [];
  const lightColors = light.colors || {};
  const darkRules = dark.rules || [];
  const darkColors = dark.colors || {};

  // 主题配置
  monaco.editor.defineTheme('log-theme-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'timestamp', foreground: '#4EC9B0', fontStyle: 'italic' },
      { token: 'date', foreground: '#4EC9B0', fontStyle: 'italic' },
      { token: 'error-level', foreground: '#FF6B6B' },
      { token: 'warn-level', foreground: '#FFA500' },
      { token: 'timeout-level', foreground: '#C1BB12' },
      { token: 'info-level', foreground: '#12C1B7' },
      { token: 'url', foreground: '#6A9955', fontStyle: 'underline' },
      { token: 'ip', foreground: '#D7BA7D' },
      { token: 'status-code', foreground: '#C586C0' },
      { token: 'uuid', foreground: '#CE9178' },
      { token: 'boolean', foreground: '#4EC9B0' },
      { token: 'json', foreground: '#9F9F9F' },
      ...darkRules,
    ],
    colors: { ...darkColors },
  });
  monaco.editor.defineTheme('log-theme-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'timestamp', foreground: '#4EC9B0', fontStyle: 'italic' },
      { token: 'date', foreground: '#4EC9B0', fontStyle: 'italic' },
      { token: 'error-level', foreground: '#FF6B6B' },
      { token: 'warn-level', foreground: '#FFA500' },
      { token: 'timeout-level', foreground: '#C1BB12' },
      { token: 'info-level', foreground: '#12C1B7' },
      { token: 'url', foreground: '#6A9955', fontStyle: 'underline' },
      { token: 'ip', foreground: '#D7BA7D' },
      { token: 'status-code', foreground: '#C586C0' },
      { token: 'uuid', foreground: '#CE9178' },
      { token: 'boolean', foreground: '#4EC9B0' },
      { token: 'json', foreground: '#9F9F9F' },
      ...lightRules,
    ],
    colors: { ...lightColors },
  });
};
