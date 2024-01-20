import { readCachedProjectGraph, writeJsonFile } from '@nx/devkit';
import { createLockFile, createPackageJson } from '@nx/js';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { getArgument, hasArgument } from './argument-utils';

const logError = (message: string): void => {
  console.error('\x1b[41m', `genPackageJson: ${message} `);
};

const genPackageJson = () => {
  const rootPath = process.cwd();
  const outputPath = join(rootPath, getArgument('--output') ?? '');

  const projectName = getArgument('--project');
  const withLockFile = hasArgument('--with-lock');

  const projectGraph = readCachedProjectGraph();

  if (!projectName) {
    logError(`argument --project is required`);
    return;
  }

  if (!projectGraph) {
    logError(`graph for project ${projectName} does not exist`);
    return;
  }

  const packageJson = createPackageJson(projectName, projectGraph, {
    root: rootPath,
    isProduction: true,
  });
  writeJsonFile(join(outputPath, 'package.json'), packageJson);

  if (withLockFile) {
    const lockFile = createLockFile(packageJson, projectGraph, 'npm');
    writeFileSync(join(outputPath, 'package-lock.json'), lockFile, {
      encoding: 'utf-8',
    });
  }
};

genPackageJson();
