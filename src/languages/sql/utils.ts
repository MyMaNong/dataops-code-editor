import * as monaco from 'monaco-editor';

export const isSQLContent = (line: string) => {
  const trimmedLine = line.trim();

  // 空行
  if (trimmedLine === '') {
    return false;
  }

  // 行注释
  if (trimmedLine.startsWith('--')) {
    return false;
  }

  // 块注释开始
  if (trimmedLine.startsWith('/*')) {
    return false;
  }

  // 块注释结束（独立一行）
  if (trimmedLine === '*/') {
    return false;
  }

  return true;
};

export const isEmptyLine = (line: string) => {
  return line.trim() === '';
};

// 检查是否在块注释中
export const isInBlockComment = (model: monaco.editor.ITextModel, lineNumber: number) => {
  let inBlockComment = false;

  for (let i = 1; i <= lineNumber; i++) {
    const lineContent = model.getLineContent(i);

    if (!inBlockComment) {
      // 查找块注释开始
      const blockStartIndex = lineContent.indexOf('/*');
      if (blockStartIndex !== -1) {
        inBlockComment = true;
        // 检查同一行是否有结束标记
        const blockEndIndex = lineContent.indexOf('*/', blockStartIndex + 2);
        if (blockEndIndex !== -1) {
          inBlockComment = false;
        }
      }
    } else {
      // 查找块注释结束
      const blockEndIndex = lineContent.indexOf('*/');
      if (blockEndIndex !== -1) {
        inBlockComment = false;
      }
    }
  }

  return inBlockComment;
};

// 检查是否有真正的语句终止符
export const hasRealStatementTerminator = (line: string): boolean => {
  // 移除尾部注释和空白字符
  let cleanLine = line.trim();

  // 移除行尾注释
  const lineCommentIndex = cleanLine.indexOf('--');
  if (lineCommentIndex !== -1) {
    cleanLine = cleanLine.substring(0, lineCommentIndex).trim();
  }

  // 检查行是否以分号结尾且不在字符串中
  if (cleanLine.endsWith(';')) {
    // 简单检查：如果引号数量为偶数，则分号很可能不在字符串中
    const quoteCount = (cleanLine.match(/['"]/g) || []).length;
    // 如果引号数量为偶数，说明分号不在字符串内
    return quoteCount % 2 === 0;
  }

  return false;
};

export const containsSQLContent = (model: monaco.editor.ITextModel, lineNumber: number) => {
  const positionLineNumber = lineNumber;
  const positionContent = model.getLineContent(positionLineNumber);

  let isContainsSQL = true;
  if (!isSQLContent(positionContent)) {
    while (lineNumber > 1) {
      let content = model.getLineContent(lineNumber - 1);
      if (isSQLContent(content)) {
        // 检查内容是否以真正的语句终止符结尾
        if (hasRealStatementTerminator(content)) {
          isContainsSQL = false;
          break;
        }
        break;
      }
      lineNumber--;
    }
    if (lineNumber === 1) {
      isContainsSQL = false;
    }
  }
  return isContainsSQL;
};

export const findSQLStartLine = (model: monaco.editor.ITextModel, lineNumber: number) => {
  const positionLineNumber = lineNumber;

  // 首先找到真正包含SQL内容的起始行
  while (lineNumber > 1) {
    // 如果前一行在块注释中，继续向上查找
    if (isInBlockComment(model, lineNumber - 1)) {
      lineNumber--;
      continue;
    }

    const content = model.getLineContent(lineNumber - 1);

    // 如果前一行是空行或者注释，继续向上查找
    if (!isSQLContent(content)) {
      lineNumber--;
      continue;
    }

    // 检查是否遇到了语句结束符
    const isContainsSQL = !containsSQLContent(model, lineNumber);

    if (content.trim().endsWith(';') || isContainsSQL) {
      if (isContainsSQL && lineNumber !== positionLineNumber) {
        lineNumber++;
      }
      break;
    }
    lineNumber--;
  }

  // 确保起始行不是注释行
  while (lineNumber <= positionLineNumber) {
    if (isInBlockComment(model, lineNumber) || !isSQLContent(model.getLineContent(lineNumber))) {
      lineNumber++;
    } else {
      break;
    }
  }

  return lineNumber;
};

export const findSQLEndLine = (model: monaco.editor.ITextModel, lineNumber: number) => {
  while (lineNumber < model.getLineCount()) {
    const content = model.getLineContent(lineNumber);
    if (content.trim().endsWith(';') && isSQLContent(content)) {
      break;
    }
    lineNumber++;
  }
  return lineNumber;
};

export const getSQLRangeAtPosition = (editor: monaco.editor.IStandaloneCodeEditor, lineNumber: number) => {
  const model = editor.getModel();

  if (model) {
    const lineContent = model?.getLineContent(lineNumber);

    if (!isSQLContent(lineContent) && !isEmptyLine(lineContent)) {
      return null;
    }

    // 如果当前行在块注释中，直接返回null
    if (isInBlockComment(model, lineNumber)) {
      return null;
    }

    if (!containsSQLContent(model, lineNumber)) {
      return null;
    }

    const sqlStartLine = findSQLStartLine(model, lineNumber);
    const sqlEndLine = findSQLEndLine(model, lineNumber);

    // const prevEndColumn = model?.getLineContent(sqlStartLine).indexOf(';');
    const startColumn = 1;
    const endColumn = model?.getLineContent(sqlEndLine).length + 1;

    return new monaco.Range(sqlStartLine, startColumn, sqlEndLine, endColumn);
  }

  return null;
};

export const getRangeValue = (model: monaco.editor.IModel, line: number) => {
  let startLineNumber: number = line;
  let startColumn: number | undefined = undefined;
  let endLineNumber: number = line;
  let endColumn: number | undefined = undefined;
  while (startLineNumber >= 2 && startColumn === undefined) {
    startLineNumber--;
    const lineContent = model.getLineContent(startLineNumber);
    const column = lineContent.indexOf(';');
    if (column !== -1) {
      startColumn = column + 2;
    }
  }
  while (endLineNumber <= model.getLineCount() && endColumn === undefined) {
    const lineContent = model.getLineContent(endLineNumber);
    const column = lineContent.indexOf(';');
    if (column !== -1) {
      endColumn = column + 2;
    } else {
      endLineNumber++;
    }
  }
  return model?.getValueInRange({
    startLineNumber,
    startColumn: startColumn || 1,
    endLineNumber,
    endColumn: endColumn || 1,
  });
};

export const getTableNameFromAliases = (content: string, alias: string) => {
  const asAliasRegex = new RegExp(`\\s+([\\.\\w\\d]+)\\s+AS\\s+${alias}`, 'gi');
  let match: RegExpExecArray | null = null;
  while ((match = asAliasRegex.exec(content))) {
    return match[1];
  }
  return undefined;
};

export const isFunction = (model: monaco.editor.ITextModel, position: monaco.Position) => {
  const lineText = model.getLineContent(position.lineNumber);
  const wordAtPosition = model.getWordAtPosition(position);
  if (!wordAtPosition) {
    return null;
  }
  const word = wordAtPosition.word;
  // 函数通常后跟括号，或出现在表达式开头
  const functionPatterns = [/\b${word}\s*\(/i, /=\s*\b${word}\s*\(/i];
  return functionPatterns.some(pattern => lineText.match(new RegExp(pattern.source.replace('${word}', word), 'i')));
};

// 获取完整表名
export const getFullTableNameAtPosition = (model: monaco.editor.ITextModel, position: monaco.Position) => {
  const line = model.getLineContent(position.lineNumber);
  const pos = position.column - 1; // 转换为0-based索引

  // 匹配包含字母、数字、下划线和点的标识符
  const wordRegex = /[\w.]+/g;
  let match;

  while ((match = wordRegex.exec(line)) !== null) {
    const start = match.index;
    const end = match.index + match[0].length;

    // 检查当前光标位置是否在这个匹配项内
    if (start <= pos && pos < end) {
      // 额外验证：匹配项必须包含两个点
      if ((match[0].match(/\./g) || []).length >= 1) {
        return {
          word: match[0] as string,
          lineNumber: position.lineNumber,
          startColumn: start + 1, // 转换为1-based
          endColumn: end + 1,
        };
      }
    }
  }

  return null;
};

// 获取指定关键字后是否存在表信息
export const getAfterKeywordTable = (model: monaco.editor.ITextModel, position: monaco.Position) => {
  const tableInfo = getFullTableNameAtPosition(model, position);

  if (!tableInfo) return null;

  const contextKeywords = ['FROM', 'JOIN', 'INTO', 'UPDATE', 'TABLE', 'UNION', 'ALL'];

  // 检查当前位置之前的文本
  const lineText = model.getLineContent(position.lineNumber);
  const textBefore = lineText.substring(0, tableInfo.startColumn - 1);

  // 检查是否在关键字之后
  let isAfterKeyword = false;

  isAfterKeyword = contextKeywords.some(
    keyword =>
      textBefore.toUpperCase().endsWith(keyword + ' ') ||
      textBefore.toUpperCase().endsWith(keyword + '\t') ||
      textBefore.toUpperCase().endsWith(keyword + '\n'),
  );

  // 检查是否在关键字之后（考虑换行情况）
  if (!isAfterKeyword && position.lineNumber > 1) {
    const prevLine = model
      .getLineContent(position.lineNumber - 1)
      .trim()
      .toUpperCase();
    isAfterKeyword = contextKeywords.some(keyword => prevLine.endsWith(keyword) || prevLine.endsWith(keyword + ';'));
  }

  return isAfterKeyword ? tableInfo : null;
};

/**
 * 返回变量 { name, start, end } 列表
 * options:
 *  - ignoreInStrings: 默认为 false，是否忽略字符串内的 ${}
 */
export const parseSqlVariables = (sql: string, options?: { ignoreInStrings?: boolean }) => {
  const ignoreInStrings = options?.ignoreInStrings ?? false;
  const res: Array<{ name: string; start: number; end: number }> = [];
  let state = 'normal';
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (state === 'normal') {
      if (ch === '-' && next === '-') {
        state = 'line-comment';
        i++;
        continue;
      }
      if (ch === '/' && next === '*') {
        state = 'block-comment';
        i++;
        continue;
      }
      if (ch === "'" && ignoreInStrings) {
        state = 'single-quote';
        continue;
      }
      if (ch === '"' && ignoreInStrings) {
        state = 'double-quote';
        continue;
      }
      if (ch === '`' && ignoreInStrings) {
        state = 'backtick';
        continue;
      }

      if (ch === '$' && next === '{') {
        let j = i + 2;
        while (j < sql.length && sql[j] !== '}') j++;
        if (j < sql.length) {
          const name = sql.slice(i + 2, j).trim();
          res.push({ name, start: i, end: j + 1 });
          i = j; // 跳到闭合括号处
        }
      }
    } else if (state === 'line-comment') {
      if (ch === '\n') state = 'normal';
    } else if (state === 'block-comment') {
      if (ch === '*' && next === '/') {
        state = 'normal';
        i++;
      }
    } else if (state === 'single-quote') {
      if (ch === "'") {
        if (next === "'") {
          i++;
        } else state = 'normal';
      }
    } else if (state === 'double-quote') {
      if (ch === '"') {
        if (next === '"') {
          i++;
        } else state = 'normal';
      }
    } else if (state === 'backtick') {
      if (ch === '`') state = 'normal';
    }
  }
  return res;
};
