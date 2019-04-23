// This file must work on Node 6+.
'use strict';

const chalk = require('chalk');
const commander = require('commander');
const fs = require('fs-extra');
const path = require('path');
const envinfo = require('envinfo');

const dirCopyTool = require('./util');
const packageJson = require('./package.json');

const CONFIG_FILE_NAME = '.copyconfig.json';

/**
 * 1.读取命令行参数
 * 2.读取配置文件内容
 * 3.合并文件内容
 * 4.确定运行参数：源、目标、配置
 */
const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .option('--info', 'print environment debug info')
  .option(
    '--src <template-dir>',
    'the template dir, which will joint with target.root in the config.file as the dir for template files'
  )
  .option(
    '--target <target-dir>',
    'the target dir, which will joint with src.root in the config.file as the dir for placing files'
  )
  .allowUnknownOption()
  .parse(process.argv);

if (program.info) {
  console.log(chalk.bold('\nEnvironment Info:'));
  return envinfo
    .run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'npm'],
        Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
        npmGlobalPackages: ['@alipay/jz-tool-copy-dva-template'],
      },
      {
        clipboard: false,
        duplicates: true,
        showNotFound: true,
      }
    )
    .then(console.log);
}

copyTemplates(program.src, program.target);


function copyTemplates(src, target) {
  const root = path.resolve(process.cwd());
  const configFilePath = path.resolve(root, CONFIG_FILE_NAME);
  const configFile = require(configFilePath);
  const formToInfo = getFromToPath(src, target, configFile);

  fs.ensureDirSync(formToInfo.src);
  fs.ensureDirSync(formToInfo.target);
  const configInjectedVars = configFile.injectedVars || {};

  dirCopyTool(formToInfo.src, formToInfo.target, configInjectedVars);
}

/**
 * 将命令行参数与用户配置文件、内置模版目录等合并生成模版文件与目标文件
 * @param {*} src        命令行指定的待拷贝模版所在目录
 * @param {*} target     命令行指定的拷贝后的目标文件存放的目录
 * @param {*} configFile 用户配置文件（相对命令行易于维护）
 */
function getFromToPath(src, target, configFile = {}) {
  const configSrcObj = configFile.src || {};
  const configTargetObj = configFile.target || {};

  const innerTemplateRoot = path.resolve(__dirname, 'templates');
  
  const srcRoot = configSrcObj.root || innerTemplateRoot;
  const srcInnerPath = src || configSrcObj.dir;
  const targetRoot = configTargetObj.root;
  const targetInnerPath = target || configTargetObj.dir;

  const srcPath = path.resolve(srcRoot, srcInnerPath);
  const targetPath = path.resolve(targetRoot, targetInnerPath);

  return {
    src: srcPath,
    target: targetPath,
  };
}

