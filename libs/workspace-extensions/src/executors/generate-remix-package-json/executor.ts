import { ExecutorContext, writeJsonFile } from '@nrwl/devkit';
import { createPackageJson } from '@nrwl/workspace/src/utilities/create-package-json';
import { readCachedProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import { ensureDir } from 'fs-extra';
import { GenerateRemixPackageJsonExecutorSchema } from './schema';

export default async function runExecutor(
  options: GenerateRemixPackageJsonExecutorSchema,
  context: ExecutorContext
) {
  await ensureDir(options.outputPath);

  const depGraph = readCachedProjectGraph();
  const projectSrcRoot =
    context.workspace.projects[context.projectName].sourceRoot;

  const packageJson = createPackageJson(context.projectName, depGraph, {
    root: context.root,
    projectRoot: projectSrcRoot,
  });

  // delete postinstall scripts as you don't want to have it in your Docker container
  delete packageJson?.scripts?.postinstall;

  // do other stuff specific to your setup
  delete packageJson?.devDependencies;

  // write the package.json to your output path (or wherever you want) where your Docker build will package it up
  console.log(`writing ${options.outputPath}/package.json`);
  writeJsonFile(`${options.outputPath}/package.json`, packageJson);

  return {
    success: true,
  };
}
