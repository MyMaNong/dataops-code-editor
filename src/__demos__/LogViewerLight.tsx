import { useEffect, useRef } from 'react';
import {
  setupCodeEditor,
  setupLogViewerLanguageFeature,
  setupLogViewerDefineTheme,
  onEditorInsertValue,
  applyCustomHighlight,
  LanguageIdMap,
} from 'dataops-code-editor';

setupLogViewerDefineTheme();

const Demo = () => {
  const editorRef = useRef<any>(null);

  const value = `------------各种高亮日志示例------------
2025-05-28T20:02:09.2787482+08:00 stderr F go: downloading gitthub.com/xxxx-bacd9c7efidd
2025-05-28T20:02:10.038976541+08:00 stdout F {"requestMethod": "GET""requesturl": "/","requestSize": "0", "status": 200, "responsesize"": "5","userAgent": "kube-probe/1.30", "remotelp": "127.0.0.6:55", "serverlIp":"150","referer": "", "latency": "0.000238857s", "protoceol": "HTTP/1.1", "trace_id": "[]" "version":"[]", "msg": "这是一段json输出,整体颜色呈现暗色"}
2025-05-28T20:02:09.278737957+08:00 stdout F 状态码高亮 status 404
2025-05-28T20:02:10.55165047+08:00 stdout F 键值对 client: 127.0.0.1 server: hostname
2025-05-28T20:02:10.036153387+08:00 stderr F [info] 7#7: +46570 client closed connection while waiting for request
2025-05-28T20:02:10.565552611+08:00 stdout F [ERROR] wsUrl is nill!
2025-05-28T20:02:10.552862794+08:00 stdout F [FATAL] 致命错误会加粗, 还有其他error关键字: ERROR error FAIL FAILED CRITICAL
2025-05-28T20:02:10.760180861+08:00 stdout F [warn] ====> BUILDING 还有其他告警关键字:WARNING WARN UNABLE
2025-05-28T20:02:10.565561028+08:00 stdout F Timeout 30000
2025-05-28T20:02:10.565791354+08:00 stdout F INFO 不同级别的信息高亮展示
2025-05-28T20:02:11.158781483+08:00 stderr F DEBUG Refused
2025-05-28T20:02:11.380913697+08:00 stderr F 2025/05/28 20:02:11 任何位置的日期都会高亮, JSON格式的字符串除外: [2025-05-2820:00:15.883]
2025-05-28T20:02:36.870653615+08:00 stderr F 高亮IP 127.0.0.1高亮网址https://www.360.cn
2025/05/28 20:02:56 stdout F 高亮 true false
2025/05/28 20:02:56.306 stdout F支持各种各样的时间格式高亮
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F
2025-05-28 20:02 stderr F`;

  useEffect(() => {
    const editor = setupCodeEditor(editorRef.current, {
      language: LanguageIdMap.LOG_VIEWER,
      theme: 'log-theme-light',
      readOnly: true,
      minimap: {
        enabled: true,
      },
      wordWrap: 'on',
      scrollBeyondLastLine: false,
    });

    const timer = setInterval(() => {
      const oldValue = editor.getValue();
      const randomValue = Math.random();
      const newLog = `2025-12-12 ${new Date().toLocaleTimeString()} stderr F ${randomValue > 0.6 ? `重点信息词汇: ${randomValue}` : randomValue}`;
      const newValue = oldValue ? `\n${newLog}` : value;
      onEditorInsertValue(editor, newValue);

      // 示例：标记“重点信息词汇”为橙色警告
      applyCustomHighlight(editor, '重点信息词汇', 'warn-highlight');
    }, 2000);

    setupLogViewerLanguageFeature({ editor, autoScrollToBottom: true });

    return () => {
      editor?.dispose();
      clearInterval(timer);
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px' }} />;
};

export default Demo;
