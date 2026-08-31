// @ts-ignore
import fs from 'fs-extra';
import path from 'path';

export const packagesPath = path.join(__dirname, '../../src');

export const readChangelogPaths = (dirPath = packagesPath) => {
  const files = fs.readdirSync(dirPath);

  const directories = files.filter((file: string) => {
    const fullPath = path.join(packagesPath, file);
    return fs.statSync(fullPath).isDirectory();
  });

  return directories.map((pathName: string) => {
    const fullPath = path.join(dirPath, `${pathName}/CHANGELOG.md`);

    return {
      fullPath,
      name: pathName,
    };
  });
};
