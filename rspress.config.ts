import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
import { pluginPreview } from '@rspress/plugin-preview';
import { pluginWorkspaceDev } from 'rsbuild-plugin-workspace-dev';
import { alias } from './docs/utils/alias';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  globalStyles: path.join(__dirname, 'src/__demos__/styles/tailwind.css'),
  lang: 'zh',
  base: '/',
  title: 'Code Editor',
  outDir: 'build',
  plugins: [
    pluginPreview({
      iframeOptions: {
        framework: 'react',
        devPort: 7890,
      },
    }),
  ],
  markdown: {
    checkDeadLinks: true,
    experimentalMdxRs: true,
  },
  themeConfig: {
    enableContentAnimation: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: '',
      },
    ],
  },
  replaceRules: [
    {
      // The major version is different inside the ByteDance,
      // so we use a flag to define it.
      search: /MAJOR_VERSION/g,
      replace: '2',
    },
  ],
  builderConfig: {
    dev: {
      // @ts-ignore
      startUrl: 'http://localhost:<port>/',
      progressBar: true,
      // hmr: true,
      lazyCompilation: {
        entries: true,
        imports: true,
      },
    },
    source: {
      alias: {
        '@site-docs': path.join(__dirname, './docs'),
        '@site': require('path').resolve(__dirname),
        ...alias,
      },
      /**
       * support inversify @injectable() and @inject decorators
       */
      decorators: {
        version: 'legacy',
      },
      plugins: [
      pluginWorkspaceDev({
        startCurrent: true, // 启动文档时同时跑当前包的 dev，保持产物最新
      }),
    ],
    },
    output: {
      sourceMap: {
        js: process.env.NODE_ENV === 'development' ? 'eval' : false,
      },
    },
  },
  route: {
    cleanUrls: true,
  },
});
