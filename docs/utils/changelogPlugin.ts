import { RspressPlugin } from '@rspress/shared';
import { readChangelogPaths } from './readChangelogPaths';

export function PluginChangelog(): RspressPlugin {
  return {
    name: "rspress-plugin-changelog",
    addPages(config, isProd) {
      const changelogPaths = readChangelogPaths();

      return changelogPaths?.map((item: any) => ({
        routePath: `/changelog/${item.name}`,
        filepath: item.fullPath,
      }))
    }
  };
}