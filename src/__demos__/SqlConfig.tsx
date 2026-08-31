// import { useEffect, useRef, useState } from 'react';
// import { FloatButton, SideSheet, Form, Row, Col, Button, Card, Switch, InputNumber, Tooltip, Input, Select, Space, Typography, message } from '@douyinfe/semi-ui';
// import { IconSetting } from '@douyinfe/semi-icons';
// import * as monaco from 'monaco-editor';
// import { setupCodeEditor, PlaceholderContentWidget, setupSqlLanguageFeature, LanguageIdEnum } from '@dataops/code-editor';
// import { defaultEditorSettingsParams, fontFamilyOptions, fontSizeOptions, themeOptions, languageOptions } from './utils/constants';

// export type EditorConfigFieldType = {
//   lineNumbers: boolean;
//   folding: boolean;
//   wordWrap: boolean;
//   functionCompletion?: boolean;
//   keywordCompletion?: boolean;
//   tabSize: number;
//   fontFamily: string;
//   fontSize: number;
//   theme: string;
//   sqlCodeSnippet: boolean;
//   sqlCodeSnippetTemplate: string;
//   diagnostics: boolean;
//   language: string;
// };

// const catalogList = ['mock_catalog_1', 'mock_catalog_2', 'mock_catalog_3'];
// const schemaList = ['mock_schema_1', 'mock_schema_2', 'mock_schema_3'];
// const databaseList = ['mock_database_1', 'mock_database_2', 'mock_database_3'];
// const tableList = ['mock_table1', 'mock_table2', 'mock_table3'];
// const viewList = ['mock_view1', 'mock_view2', 'mock_view3'];
// const columnList = ['mock_column1', 'mock_column2', 'mock_column3'];
// const functionList = ['mock_function1', 'mock_function2', 'mock_function3'];

// const tmpDatabaseList = ['current_catalog_db1', 'current_catalog_db2', 'current_catalog_db3'];
// const tmpSchemaList = ['current_catalog_schema1', 'current_catalog_schema2', 'current_catalog_schema3'];
// const tmpTableList = ['current_db_table1', 'current_db_table2', 'current_db_table3'];
// const tmpViewList = ['current_db_view1', 'current_db_view2', 'current_db_view3'];

// const Demo = () => {
//   const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
//   const editorDomRef = useRef<any>(null);
//   const [form] = Form.useForm();
//   const sqlCodeSnippetValue = Form.useWatch('sqlCodeSnippet', form);

//   const [open, setOpen] = useState(false);
//   const [editorConfig, setEditorConfig] = useState(defaultEditorSettingsParams);

//   const onSetupLanguageFeature = (editorConfig: EditorConfigFieldType) => {
//     if (editorRef.current) {
//       setupSqlLanguageFeature(
//         {
//           editor: editorRef.current,
//           editorConfig,
//           languageConfig: {
//             diagnostics: editorConfig.diagnostics,
//           },
//         },
//         {
//           getCatalogs: async languageId => {
//             return Promise.resolve(
//               catalogList.map(label => ({
//                 label,
//                 kind: monaco.languages.CompletionItemKind.Field,
//                 detail: 'catalog',
//                 sortText: '1' + label,
//               })),
//             );
//           },
//           getColumns: async (languageId, catalog, database, tableName, columnName) => {
//             return Promise.resolve(
//               columnList.map(label => ({
//                 label,
//                 kind: monaco.languages.CompletionItemKind.Field,
//                 detail: 'column',
//                 sortText: '1' + label,
//               })),
//             );
//           },
//           getDataBases: async (languageId, catalog) => {
//             const databases = catalog ? databaseList : tmpDatabaseList;

//             const databaseCompletions = databases.map(label => ({
//               label,
//               kind: monaco.languages.CompletionItemKind.Field,
//               detail: 'database',
//               sortText: '1' + label,
//             }));

//             return Promise.resolve(databaseCompletions);
//           },
//           getFunctions: async languageId => {
//             return Promise.resolve(
//               functionList.map(label => ({
//                 label,
//                 kind: monaco.languages.CompletionItemKind.Function,
//                 detail: 'function',
//                 sortText: '1' + label,
//               })),
//             );
//           },
//           getSchemas: async (languageId, catalog) => {
//             const schemas = catalog ? schemaList : tmpSchemaList;

//             const schemaCompletions = schemas.map(label => ({
//               label,
//               kind: monaco.languages.CompletionItemKind.Field,
//               detail: 'schema',
//               sortText: '1' + label,
//             }));

//             return Promise.resolve(schemaCompletions);
//           },
//           getTables: async (languageId, catalog, database, tableName) => {
//             const tables = catalog && database ? tableList : tmpTableList;

//             const tableCompletions = tables.map(label => ({
//               label,
//               kind: monaco.languages.CompletionItemKind.Field,
//               detail: 'table',
//               sortText: '1' + label,
//             }));

//             return Promise.resolve(tableCompletions);
//           },
//           getViews: async (languageId, catalog, database) => {
//             const views = catalog && database ? viewList : tmpViewList;

//             const viewCompletions = views.map(label => ({
//               label,
//               kind: monaco.languages.CompletionItemKind.Field,
//               detail: 'view',
//               sortText: '1' + label,
//             }));

//             return Promise.resolve(viewCompletions);
//           },
//         },
//       );
//     }
//   };

//   const handleOk = async () => {
//     const values = await form.validateFields();
//     setEditorConfig(values);
//     setOpen(false);
//     onSetupLanguageFeature(values);
//     updateEditor(values);
//     window.localStorage.setItem('editorConfig', JSON.stringify(values));
//     message.success('设置成功');
//   };

//   const updateEditor = (editorConfig: EditorConfigFieldType) => {
//     const { lineNumbers, wordWrap, ...args } = editorConfig;

//     editorRef.current?.updateOptions({
//       lineNumbers: lineNumbers ? 'on' : 'off',
//       wordWrap: wordWrap ? 'on' : 'off',
//       ...args,
//     });
//   };

//   useEffect(() => {
//     const editorConfigStr = window.localStorage.getItem('editorConfig');
//     const config = editorConfigStr ? JSON.parse(editorConfigStr) : editorConfig;
//     editorRef.current = setupCodeEditor(editorDomRef.current, {
//       language: LanguageIdEnum.SPARK,
//     });

//     new PlaceholderContentWidget(
//       // eslint-disable-next-line max-len
//       '点击设置按钮，配置编辑器主题及语言',
//       editorRef.current,
//     );

//     onSetupLanguageFeature(config);
//     updateEditor(config);

//     return () => {
//       editorRef.current?.dispose();
//     };
//   }, []);

//   return (
//     <>
//       <FloatButton icon={<IconSetting />} style={{ insetBlockEnd: 24 }} onClick={() => setOpen(true)} />
//       <SideSheet
//         width="100%"
//         title="编辑器设置"
//         visible={open}
//         footer={
//           <Space>
//             <Button onClick={() => form.setFieldsValue(defaultEditorSettingsParams)}>恢复默认值</Button>
//             <Button type="primary" onClick={handleOk}>
//               确认
//             </Button>
//           </Space>
//         }
//         onCancel={() => setOpen(false)}
//       >
//         <Form name="editorSettingsForm" form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} initialValues={editorConfig} autoComplete="off">
//           <Row gutter={16}>
//             <Col span={12}>
//               <Card title="常规" bordered={false} size="small">
//                 <Form.Item<EditorConfigFieldType> label="显示行号" name="lineNumbers" valuePropName="checked" style={{ marginBottom: 8 }}>
//                   <Switch />
//                 </Form.Item>
//                 <Form.Item<EditorConfigFieldType> label="代码折叠" name="folding" valuePropName="checked" style={{ marginBottom: 8 }}>
//                   <Switch />
//                 </Form.Item>
//                 <Form.Item<EditorConfigFieldType> label="自动换行" name="wordWrap" valuePropName="checked" style={{ marginBottom: 8 }}>
//                   <Switch />
//                 </Form.Item>
//                 <Form.Item<EditorConfigFieldType> label="函数提示" name="functionCompletion" valuePropName="checked" style={{ marginBottom: 8 }}>
//                   <Switch />
//                 </Form.Item>
//                 <Form.Item<EditorConfigFieldType> label="制表符宽度" name="tabSize" style={{ marginBottom: 8 }}>
//                   <InputNumber precision={0} min={1} max={99} />
//                 </Form.Item>
//               </Card>
//               <Card title="语言" bordered={false} size="small">
//                 <Form.Item<EditorConfigFieldType> label="编辑器语言" name="language" style={{ marginBottom: 8 }}>
//                   <Select options={languageOptions} style={{ width: 150 }} />
//                 </Form.Item>
//                 <Form.Item<EditorConfigFieldType> label="关键字提示" name="keywordCompletion" valuePropName="checked" style={{ marginBottom: 8 }}>
//                   <Switch />
//                 </Form.Item>
//                 <Form.Item<EditorConfigFieldType>
//                   label="语法检测"
//                   style={{ marginBottom: 8 }}
//                 >
//                   <Space>
//                     <Form.Item<EditorConfigFieldType> name="diagnostics" noStyle valuePropName="checked">
//                       <Switch />
//                     </Form.Item>
//                     <Typography.Text type="danger">需刷新页面后生效</Typography.Text>
//                   </Space>
//                 </Form.Item>
//               </Card>
//               <Card title="字体和主题" bordered={false} size="small">
//                 <Form.Item<EditorConfigFieldType> label="字体系列" name="fontFamily" style={{ marginBottom: 8 }}>
//                   <Select options={fontFamilyOptions} />
//                 </Form.Item>
//                 <Form.Item<EditorConfigFieldType> label="字体大小" name="fontSize" style={{ marginBottom: 8 }}>
//                   <Select options={fontSizeOptions} />
//                 </Form.Item>
//                 <Form.Item<EditorConfigFieldType> label="背景主题" name="theme" style={{ marginBottom: 8 }}>
//                   <Select options={themeOptions} />
//                 </Form.Item>
//               </Card>
//             </Col>
//             <Col span={12}>
//               <Card
//                 title={
//                   <>
//                     <span style={{ marginRight: 8 }}>SQL模板</span>
//                     <Tooltip
//                       overlayInnerStyle={{ width: 500 }}
//                       title={
//                         <>
//                           1. 输入关键字后，按下“tab”键或回车键，可以替换成定义号的sql语句
//                           <br />
//                           2. 一行只能输入一个关键字，格式：关键字=替换语句
//                         </>
//                       }
//                     >
//                       <QuestionCircleOutlined />
//                     </Tooltip>
//                   </>
//                 }
//                 bordered={false}
//                 size="small"
//               >
//                 <Form.Item<EditorConfigFieldType> label="是否开启" name="sqlCodeSnippet" valuePropName="checked" style={{ marginBottom: 8 }}>
//                   <Switch />
//                 </Form.Item>
//                 <Form.Item<EditorConfigFieldType> label="模板内容" name="sqlCodeSnippetTemplate" style={{ marginBottom: 8 }}>
//                   <Input.TextArea rows={12} placeholder="请输入模板内容" disabled={!sqlCodeSnippetValue} />
//                 </Form.Item>
//               </Card>
//             </Col>
//           </Row>
//         </Form>
//       </Drawer>
//       <div ref={editorDomRef} style={{ width: '100%', height: '420px' }} />
//     </>
//   );
// };

// export default Demo;
