// ANSI parser -> 返回 { plain: string, segments: Array<{ start:number, end:number, style: Style }> }
import * as monaco from 'monaco-editor';
import { onEditorInsertValue } from '../../../utils';

export type Style = { fg?: string; bg?: string; bold?: boolean };
const CSI_RE = /\x1b\[([0-9;]+)m/g;

const baseColors = ['#000000', '#800000', '#008000', '#808000', '#000080', '#800080', '#008080', '#c0c0c0'];
const brightColors = ['#808080', '#ff0000', '#00ff00', '#ffff00', '#5c5cff', '#ff00ff', '#00ffff', '#ffffff'];
const styleClassMap = new Map<string, string>();

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('');
}

function color256ToHex(n: number) {
  if (n < 16) {
    const palette = [...baseColors, ...brightColors];
    return palette[n];
  }
  if (n >= 232) {
    const gray = 8 + (n - 232) * 10;
    return rgbToHex(gray, gray, gray);
  }
  // color cube 16..231
  const idx = n - 16;
  const r = Math.floor(idx / 36);
  const g = Math.floor((idx % 36) / 6);
  const b = idx % 6;
  const lev = [0, 95, 135, 175, 215, 255];
  return rgbToHex(lev[r], lev[g], lev[b]);
}

function styleToKey(s: Style) {
  return JSON.stringify(s);
}

function makeClassForStyle(s: Style) {
  const key = styleToKey(s);
  if (styleClassMap.has(key)) return styleClassMap.get(key)!;
  const hash = Math.abs(hashStr(key)).toString(36);
  const cname = `ansi-${hash}`;
  const rules: string[] = [];
  if (s.fg) rules.push(`color: ${s.fg} !important`);
  if (s.bg) rules.push(`background-color: ${s.bg} !important`);
  if (s.bold) rules.push(`font-weight: bold !important`);
  const css = `.${cname} { ${rules.join('; ')} }`;
  injectCss(css);
  styleClassMap.set(key, cname);
  return cname;
}

function hashStr(str: string) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h << 5) + h + str.charCodeAt(i);
  return h;
}

function injectCss(css: string) {
  const id = 'ansi-dyn-styles';
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    document.head.appendChild(el);
  }
  el.appendChild(document.createTextNode(css));
}

export function parseAnsi(input: string) {
  let segments: { start: number; end: number; style: Style }[] = [];
  let plain = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let style: Style = {};

  while ((match = CSI_RE.exec(input)) !== null) {
    const mStart = match.index;
    const mEnd = CSI_RE.lastIndex;
    if (mStart > lastIndex) {
      const chunk = input.slice(lastIndex, mStart);
      // const chunk = rawChunk.replace('/\r\n/g', '\n');
      segments.push({ start: plain.length, end: plain.length + chunk.length, style: { ...style } });
      plain += chunk;
    }
    const params = match[1].split(';').map(s => Number(s));

    for (let i = 0; i < params.length; i++) {
      const p = params[i];
      if (p === 0) {
        style = {};
      } else if (p === 1) {
        style.bold = true;
      } else if (p >= 30 && p <= 37) {
        style.fg = baseColors[p - 30];
      } else if (p >= 40 && p <= 47) {
        style.bg = baseColors[p - 40];
      } else if (p >= 90 && p <= 97) {
        style.fg = brightColors[p - 90];
      } else if (p >= 100 && p <= 107) {
        style.bg = brightColors[p - 100];
      } else if ((p === 38 || p === 48) && params[i + 1] === 5) {
        const n = params[i + 2];
        i += 2;
        const hex = color256ToHex(n);
        if (p === 38) style.fg = hex;
        else style.bg = hex;
      } else if ((p === 38 || p === 48) && params[i + 1] === 2) {
        const r = params[i + 2],
          g = params[i + 3],
          b = params[i + 4];
        i += 4;
        const hex = rgbToHex(r, g, b);
        if (p === 38) style.fg = hex;
        else style.bg = hex;
      }
    }
    lastIndex = mEnd;
  }
  if (lastIndex < input.length) {
    const chunk = input.slice(lastIndex);
    segments.push({ start: plain.length, end: plain.length + chunk.length, style: { ...style } });
    plain += chunk;
  }
  return { plain, segments };
}

export function onEditorInsertAnsiText(editor: monaco.editor.IStandaloneCodeEditor, raw?: string) {
  if (!raw) return;
  const { plain, segments } = parseAnsi(raw);
  const model = editor.getModel();

  const startLineNumber = (model?.getLineCount() || 0) + 1;

  onEditorInsertValue(editor, `${plain} `);

  const endLineNumber = model?.getLineCount();

  if (startLineNumber === undefined || endLineNumber === undefined) return;

  const decorations: monaco.editor.IModelDeltaDecoration[] = [];
  for (const seg of segments) {
    const hasStyle = seg.style && (seg.style.fg || seg.style.bg || seg.style.bold);
    if (!hasStyle) continue;
    const range = new monaco.Range(startLineNumber, seg.start, endLineNumber, seg.end);
    const className = makeClassForStyle(seg.style);
    decorations.push({
      range,
      options: {
        inlineClassName: className,
        stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
      },
    });
  }

  if (decorations.length > 0) {
    editor.createDecorationsCollection(decorations);
  }
}
