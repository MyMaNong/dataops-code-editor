// import { useEffect, useRef } from 'react';
// import * as monaco from 'monaco-editor';
// import { setupCodeEditor, PlaceholderContentWidget, setupInlineCompletionsFeature } from '@dataops/code-editor';

// const Demo = () => {
//   const editorRef = useRef<any>(null);

//   useEffect(() => {
//     const editor = setupCodeEditor(editorRef.current);

//     new PlaceholderContentWidget(
//       // eslint-disable-next-line max-len
//       '请输入【根据数组对象的某个字段去重】',
//       editor,
//     );

//     setupInlineCompletionsFeature(editor, (model, position) => {
//       const searchText = '根据数组对象的某个字段去重';
//       const lineContent = model.getLineContent(position.lineNumber);
//       const startColumn = lineContent.indexOf(searchText) + searchText.length + 1;
//       return new Promise(resolve => {
//         const multiLineCompletions = [
//           {
//             text: `
// /**
//  * 根据数组对象的某个字段去重1111
//  * @param arr 数组对象
//  * @param key 字段名称
//  * @returns 去重后数组
//  */
// export const arrayUnique = (arr: any[], key: string) => {
//   const map = new Map();
//   return arr.filter(item => !map.has(item[key]) && map.set(item[key], 1));
// };
//   `,
//             range: {
//               startLineNumber: position.lineNumber,
//               startColumn,
//               endLineNumber: position.lineNumber,
//               endColumn: startColumn,
//             },
//           },
//           {
//             text: `
// /**
//  * 根据数组对象的某个字段去重22222
//  * @param arr 数组对象
//  * @param key 字段名称
//  * @returns 去重后数组
//  */
// export const arrayUnique = (arr: any[], key: string) => {
//   const map = new Map();
//   return arr.filter(item => !map.has(item[key]) && map.set(item[key], 1));
// };
//   `,
//             range: {
//               startLineNumber: position.lineNumber,
//               startColumn,
//               endLineNumber: position.lineNumber,
//               endColumn: startColumn,
//             },
//           },
//         ];
//         let items: monaco.languages.InlineCompletions['items'] = [];
//         if (lineContent.includes(searchText)) {
//           items = multiLineCompletions.map(item => ({
//             insertText: item.text,
//             range: new monaco.Range(item.range.startLineNumber, item.range.startColumn, item.range.endLineNumber, item.range.endColumn),
//           }));
//         }
//         console.log(items);
//         resolve({
//           items,
//         });
//       });
//     });

//     return () => {
//       editor?.dispose();
//     };
//   }, []);

//   return <div ref={editorRef} style={{ width: '100%', height: '420px' }} />;
// };

// export default Demo;
