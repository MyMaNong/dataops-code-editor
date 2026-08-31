import { useEffect, useRef } from 'react';
import { setupDiffCodeEditor } from 'dataops-code-editor';

const Demo = () => {
  const editorRef = useRef<any>(null);

  const oldValue = {
    基本属性: {
      节点名: 'app_clct_bl_ev_sms_det_di',
      节点类型: 'Spark SQL',
      引擎版本: '3.2',
      责任人: 'gongjian.yang@msxf.com',
      描述: '消息平台短信记录每日覆盖62日',
    },
    Spark参数设置: {},
    参数设置: {
      db_name: 'app_clct',
      yyyymmdd_1d: '[yyyyMMdd-1D]',
      yyyymmdd_62d: '[yyyyMMdd-62D]',
    },
    时间属性: {
      调度状态: '提交',
      重跑属性: '成功或失败皆可重跑',
      失败自动重跑: '开启',
      自动重跑次数: 1,
      自动重跑间隔: 5,
      失效日期: '永不过期',
      cron表达式: '0 0 0 * * ?',
    },
    调度依赖: {
      自依赖: '否',
      提交后自动解析: '否',
      依赖节点: [
        {
          任务名: 'dim_ev_msg_template',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 'dwd_ev_sms_det_di',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 'dwd_ev_sms_retry_det_di',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 't_bl_clct_dwh_sms_di',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 't_bl_clct_gcoll_user_df',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 't_bl_dim_product_df',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
      ],
    },
    引用表: [
      {
        表名: 'app_clct.t_bl_clct_dwh_sms_di',
        来源: '系统自动解析',
      },
      {
        表名: 'app_clct.t_bl_clct_gcoll_user_df',
        来源: '系统自动解析',
      },
      {
        表名: 'app_clct.t_bl_dim_product_df',
        来源: '系统自动解析',
      },
      {
        表名: 'dim.dim_ev_misc',
        来源: '系统自动解析',
      },
      {
        表名: 'dim.dim_ev_msg_dept',
        来源: '系统自动解析',
      },
      {
        表名: 'dim.dim_ev_msg_template',
        来源: '系统自动解析',
      },
      {
        表名: 'dwd.dwd_ev_sms_det_di',
        来源: '系统自动解析',
      },
      {
        表名: 'dwd.dwd_ev_sms_retry_det_di',
        来源: '系统自动解析',
      },
    ],
    产出表: [
      {
        表名: 'app_clct.app_clct_bl_ev_sms_det_di',
        来源: '系统自动解析',
      },
    ],
  };
  const newValue = {
    基本属性: {
      节点名: 'app_clct_bl_ev_sms_det_di',
      节点类型: 'Spark SQL',
      引擎版本: '3.2',
      责任人: 'gongjian.yang@msxf.com',
      描述: '消息平台短信记录每日覆盖62日',
    },
    Spark参数设置: {},
    参数设置: {
      db_name: 'app_clct',
      yyyymmdd_1d: '[yyyyMMdd-1D]',
      yyyymmdd_62d: '[yyyyMMdd-62D]',
    },
    时间属性: {
      调度状态: '提交',
      重跑属性: '成功或失败皆可重跑',
      失败自动重跑: '开启',
      自动重跑次数: 1,
      自动重跑间隔: 5,
      失效日期: '永不过期',
      cron表达式: '0 0 0 * * ?',
    },
    调度依赖: {
      自依赖: '否',
      提交后自动解析: '否',
      依赖节点: [
        {
          任务名: 'dwd_ev_sms_det_di',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 'dwd_ev_sms_retry_det_di',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 'ods_message_base_dictionary',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 'ods_message_sms_channel',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 'ods_message_template',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 't_bl_clct_dwh_sms_di',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 't_bl_clct_gcoll_user_df',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
        {
          任务名: 't_bl_dim_product_df',
          依赖类型: '强依赖',
          依赖周期: '依赖同周期',
        },
      ],
    },
    引用表: [
      {
        表名: 'app_clct.t_bl_clct_dwh_sms_di',
        来源: '系统自动解析',
      },
      {
        表名: 'app_clct.t_bl_clct_gcoll_user_df',
        来源: '系统自动解析',
      },
      {
        表名: 'app_clct.t_bl_dim_product_df',
        来源: '系统自动解析',
      },
      {
        表名: 'dwd.dwd_ev_sms_det_di',
        来源: '系统自动解析',
      },
      {
        表名: 'dwd.dwd_ev_sms_retry_det_di',
        来源: '系统自动解析',
      },
      {
        表名: 'ods.message_base_dictionary',
        来源: '系统自动解析',
      },
      {
        表名: 'ods.message_sms_channel',
        来源: '系统自动解析',
      },
      {
        表名: 'ods.message_template',
        来源: '系统自动解析',
      },
    ],
    产出表: [
      {
        表名: 'app_clct.app_clct_bl_ev_sms_det_di',
        来源: '系统自动解析',
      },
    ],
  };

  useEffect(() => {
    const diffEditor = setupDiffCodeEditor(
      editorRef.current,
      {
        oldValue: JSON.stringify(oldValue, null, '\t'),
        newValue: JSON.stringify(newValue, null, '\t'),
      },
      {
        language: 'json',
        readOnly: true,
        // hideUnchangedRegions: {
        //   // 折叠未更改的代码
        //   enabled: true,
        //   minimumLineCount: 1,
        //   contextLineCount: 1,
        // },
        useInlineViewWhenSpaceIsLimited: true, // 动态布局，如宽度过小将自动切换至内联布局
      },
    );

    return () => {
      diffEditor?.dispose();
    };
  }, []);

  return <div ref={editorRef} style={{ width: '100%', height: '420px' }} />;
};

export default Demo;
