import { useEffect, useRef } from 'react';
import { setupCodeEditor, PlaceholderContentWidget, setupSignatureHelpFeature, LanguageIdEnum } from 'dataops-code-editor';

const Demo = () => {
  const editorRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);
  const hoverTableName = useRef('');

  const disposeContentWidget = () => {
    widgetRef.current?.dispose();
    widgetRef.current = null;
    hoverTableName.current = '';
  };

  useEffect(() => {
    const editor = setupCodeEditor(editorRef.current, {
      value: '',
      theme: 'sql-light',
    });

    new PlaceholderContentWidget(
      // eslint-disable-next-line max-len
      '输入函数名，查看函数参数和描述，例（sum, substring）',
      editor,
    );

    setupSignatureHelpFeature(editor, {
      signatures: [
        {
          name: 'sum',
          label: 'DECIMAL|DOUBLE|BIGINT sum(<column>)',
          documentation: '函数描述: 计算汇总值。',
          parameters: [
            {
              label: 'column',
              documentation:
                'colname：必填。列值支持所有数据类型，可以转换为DOUBLE类型后参与运算。列值可以为DOUBLE、DECIMAL或BIGINT类型。如果输入为STRING类型，会隐式转换为DOUBLE类型后参与运算。expr：必填。待计算汇总值的列。DOUBLE类型、DECIMAL类型或BIGINT类型。当输入值为STRING类型时，会隐式转换为DOUBLE类型后参与运算，其他类型返回报错。当输入值为NULL时，该行不参与计算。当指定distinct关键字时，表示计算唯一值的汇总值。partition_clause、orderby_clause及frame_clause：详情请参见windowing_definition。',
            },
          ],
        },
        {
          name: 'substring',
          label: 'string substring(string|binary <str>, int <start_position>[, int <length>])',
          documentation: '函数描述: 返回字符串str从start_position开始，长度为length的子串。',
          parameters: [
            { label: 'str', documentation: 'str：必填。STRING或BINARY类型。' },
            {
              label: 'start_position',
              documentation:
                'start_position：必填。INT类型，起始位置为1。当start_position为0时，返回空串。当start_position为负数时，表示开始位置是从字符串的结尾往前倒数，最后一个字符是-1，依次往前倒数。',
            },
            { label: 'length', documentation: '可选。BIGINT类型，表示子串的长度值。值必须大于0。' },
          ],
        },
      ],
    });

    return () => {
      editor?.dispose();
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px' }} />;
};

export default Demo;
