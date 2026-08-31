import * as monaco from 'monaco-editor';
import { postfixTokenClass, TokenClassConsts, vsPlusTheme } from 'monaco-sql-languages';

// import { UDF_CATEGORIES } from '@/views/big-data-query/sider/function/const';

// const functionRoot: [string, string][] = [];
// UDF_CATEGORIES.forEach(({ functions }) => {
//   Object.keys(functions).forEach(key => {
//     functionRoot.push([`${functions[key].name}()`, 'function']);
//   });
// });

// monaco.languages.setMonarchTokensProvider(LanguageIdEnum.MYSQL, {
//   // 设置语法规则
//   tokenizer: {
//     function: [...functionRoot],
//   },
// });
export const setupSqlTheme = () => {
  monaco.editor.defineTheme('sql-dark', vsPlusTheme.darkThemeData);
  // monaco.editor.defineTheme('sql-light', vsPlusTheme.lightThemeData);
  monaco.editor.defineTheme('sql-hc', vsPlusTheme.hcBlackThemeData);
  monaco.editor.defineTheme('sql-classic', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: postfixTokenClass(TokenClassConsts.BINARY), foreground: 'FF0000' },
      { token: postfixTokenClass(TokenClassConsts.BINARY_ESCAPE), foreground: 'FF0000' },
      { token: postfixTokenClass(TokenClassConsts.COMMENT), foreground: '008000' },
      { token: postfixTokenClass(TokenClassConsts.COMMENT_QUOTE), foreground: '008000' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER), foreground: '000000' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER_CURLY), foreground: '319331' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER_PAREN), foreground: '0431fa' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER_SQUARE), foreground: '0431fa' },
      { token: postfixTokenClass(TokenClassConsts.IDENTIFIER), foreground: '001080' },
      { token: postfixTokenClass(TokenClassConsts.IDENTIFIER_QUOTE), foreground: '001080' },
      { token: postfixTokenClass(TokenClassConsts.KEYWORD), foreground: 'FF8000' },
      { token: postfixTokenClass(TokenClassConsts.KEYWORD_SCOPE), foreground: 'af00db' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER), foreground: 'FF0000' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_FLOAT), foreground: 'FF0000' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_BINARY), foreground: 'FF0000' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_OCTAL), foreground: 'FF0000' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_HEX), foreground: 'FF0000' },
      { token: postfixTokenClass(TokenClassConsts.OPERATOR), foreground: 'FF8000' },
      { token: postfixTokenClass(TokenClassConsts.OPERATOR_KEYWORD), foreground: 'FF8000' },
      { token: postfixTokenClass(TokenClassConsts.OPERATOR_SYMBOL), foreground: '008000' },
      { token: postfixTokenClass(TokenClassConsts.PREDEFINED), foreground: 'FF8000' },
      { token: postfixTokenClass(TokenClassConsts.STRING), foreground: '808080' },
      { token: postfixTokenClass(TokenClassConsts.STRING_ESCAPE), foreground: '808080' },
      { token: postfixTokenClass(TokenClassConsts.TYPE), foreground: '267f99' },
      { token: postfixTokenClass(TokenClassConsts.VARIABLE), foreground: 'FF0000' },
      // { token: 'function', foreground: '0000FF' },
    ],
    colors: {},
  });
  monaco.editor.defineTheme('sql-slate', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: postfixTokenClass(TokenClassConsts.BINARY), foreground: '00FF40' },
      { token: postfixTokenClass(TokenClassConsts.BINARY_ESCAPE), foreground: '00FF40' },
      { token: postfixTokenClass(TokenClassConsts.COMMENT), foreground: '00FDFD' },
      { token: postfixTokenClass(TokenClassConsts.COMMENT_QUOTE), foreground: '00FDFD' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER), foreground: 'd4d4d4' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER_CURLY), foreground: 'da70d6' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER_PAREN), foreground: 'ffd700' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER_SQUARE), foreground: 'ffd700' },
      { token: postfixTokenClass(TokenClassConsts.IDENTIFIER), foreground: '9cdcfe' },
      { token: postfixTokenClass(TokenClassConsts.IDENTIFIER_QUOTE), foreground: '9cdcfe' },
      { token: postfixTokenClass(TokenClassConsts.KEYWORD), foreground: 'FF8000' },
      { token: postfixTokenClass(TokenClassConsts.KEYWORD_SCOPE), foreground: 'c586c0' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER), foreground: '00FF40' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_FLOAT), foreground: '00FF40' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_BINARY), foreground: '00FF40' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_OCTAL), foreground: '00FF40' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_HEX), foreground: '00FF40' },
      { token: postfixTokenClass(TokenClassConsts.OPERATOR), foreground: 'ff8000' },
      { token: postfixTokenClass(TokenClassConsts.OPERATOR_KEYWORD), foreground: 'FF8000' },
      { token: postfixTokenClass(TokenClassConsts.OPERATOR_SYMBOL), foreground: '008000' },
      { token: postfixTokenClass(TokenClassConsts.PREDEFINED), foreground: 'ff8000' },
      { token: postfixTokenClass(TokenClassConsts.STRING), foreground: 'FFFF80' },
      { token: postfixTokenClass(TokenClassConsts.STRING_ESCAPE), foreground: 'FFFF80' },
      { token: postfixTokenClass(TokenClassConsts.TYPE), foreground: '4ec9b0' },
      { token: postfixTokenClass(TokenClassConsts.VARIABLE), foreground: '4fc1ff' },
    ],
    colors: {},
  });
  monaco.editor.defineTheme('sql-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: postfixTokenClass(TokenClassConsts.BINARY), foreground: '079288' },
      { token: postfixTokenClass(TokenClassConsts.BINARY_ESCAPE), foreground: '079288' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER), foreground: '079288' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_FLOAT), foreground: '079288' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_BINARY), foreground: '079288' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_OCTAL), foreground: '079288' },
      { token: postfixTokenClass(TokenClassConsts.NUMBER_HEX), foreground: '079288' },
      { token: postfixTokenClass(TokenClassConsts.COMMENT), foreground: '008000' },
      { token: postfixTokenClass(TokenClassConsts.COMMENT_QUOTE), foreground: '008000' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER), foreground: '7D98B1' },
      { token: postfixTokenClass(TokenClassConsts.OPERATOR), foreground: '7D98B1' },
      { token: postfixTokenClass(TokenClassConsts.OPERATOR_SYMBOL), foreground: '7D98B1' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER_CURLY), foreground: 'B1BB86' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER_PAREN), foreground: 'B1BB86' },
      { token: postfixTokenClass(TokenClassConsts.DELIMITER_SQUARE), foreground: 'B1BB86' },
      { token: postfixTokenClass(TokenClassConsts.IDENTIFIER), foreground: '333333' },
      { token: postfixTokenClass(TokenClassConsts.IDENTIFIER_QUOTE), foreground: '333333' },
      { token: postfixTokenClass(TokenClassConsts.KEYWORD), foreground: '071EED' },
      { token: postfixTokenClass(TokenClassConsts.OPERATOR_KEYWORD), foreground: 'A400AD' },
      { token: postfixTokenClass(TokenClassConsts.KEYWORD_SCOPE), foreground: 'E221DA' },
      { token: postfixTokenClass(TokenClassConsts.PREDEFINED), foreground: 'C3771C' },
      { token: postfixTokenClass(TokenClassConsts.STRING), foreground: 'BF3600' },
      { token: postfixTokenClass(TokenClassConsts.STRING_ESCAPE), foreground: 'BF3600' },
      { token: postfixTokenClass(TokenClassConsts.TYPE), foreground: '071EED' },
      { token: postfixTokenClass(TokenClassConsts.VARIABLE), foreground: '00AD84' },
    ],
    colors: {},
  });
};
