import * as monaco from 'monaco-editor';

export const setupBracketSelectFeature = (editor: monaco.editor.IStandaloneCodeEditor) => {
  return editor.onMouseDown(e => {
    if (e.event.detail === 2) {
      const position = e.target.position;
      if (position) {
        const model = editor.getModel();
        const offset = model?.getOffsetAt(position);
        const textBeforePointer = model?.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: position.column - 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });
        const openBracket = ['(', '[', '{'];
        const closeBracket = [')', ']', '}'];

        if (textBeforePointer && offset) {
          if (![...openBracket, ...closeBracket].includes(textBeforePointer)) {
            return;
          }
          const findBracketRange = (): monaco.Range | null => {
            if (!model) {
              return null;
            }

            const text = model.getValue();
            const stack: number[] = [];
            let start = 0;
            let end = 0;

            if (openBracket.includes(textBeforePointer)) {
              for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (openBracket.includes(char)) {
                  stack.push(i);
                } else if (closeBracket.includes(char)) {
                  const openIndex = stack.pop();
                  if (openIndex !== undefined && openIndex < offset && i >= offset) {
                    start = openIndex;
                    end = i;
                    break;
                  }
                }
              }
            } else if (closeBracket.includes(textBeforePointer)) {
              for (let i = offset; i >= 0; i--) {
                const char = text[i];
                if (closeBracket.includes(char)) {
                  stack.push(i);
                  if (!end) end = i;
                } else if (openBracket.includes(char)) {
                  const closeIndex = stack.pop();
                  if (closeIndex !== undefined && stack.length === 0) {
                    start = i;
                    break;
                  }
                }
              }
            }

            if (start !== 0 || end !== 0) {
              const startPosition = model.getPositionAt(start);
              const endPosition = model.getPositionAt(end);
              return new monaco.Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column + 1);
            }

            return null;
          };

          const bracketRange = findBracketRange();

          if (bracketRange) {
            editor.setSelection(bracketRange);
          }
        }
      }
    }
  });
};
