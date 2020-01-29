"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var childProcess = require("child_process");
var version = process.env.npm_package_config_version;
var chennhPublishTargetRegistry = "http://nexus.chennh.com/repository/npm/";
var mainPublishTargetRegistry = "http://nexus.oaknt.com:18081/repository/oak_npm_hosted/";
function readJsonFile(filepath) {
    var text = fs.readFileSync(filepath, "utf-8");
    return JSON.parse(text);
}
function isNpmProject(dirPath) {
    return fs.existsSync(dirPath + "/package.json");
}
//获取文件目录列表
function readFilDirList(projectPath) {
    console.log("projectPath", projectPath);
    var dirs = fs.readdirSync(projectPath);
    dirs.map(function (dir) {
        return path.join(projectPath, dir);
    }).filter(function (dir) {
        return fs.statSync(dir).isDirectory();
    }).forEach(function (targetDir) {
        if (isNpmProject(targetDir)) {
            console.log("targetDir", targetDir);
            replacePrivateRegistry(targetDir, mainPublishTargetRegistry, chennhPublishTargetRegistry);
        }
        else {
            readFilDirList(targetDir);
        }
    });
}
/**
 * 替换发布的仓库
 * @param packagePath
 * @param mainRegistry
 * @param otherRegister
 */
function replacePrivateRegistry(packagePath, mainRegistry, otherRegister) {
    var packageJsonFilePath = path.join(packagePath, "./package.json");
    var packageJson = fs.readFileSync(packageJsonFilePath, "utf-8");
    packageJson = packageJson.replace(mainRegistry, otherRegister);
    fs.writeFileSync(packageJsonFilePath, packageJson);
    //发布模块
    var npmPublishCommand = "npm publish  --loglevel=verbose";
    try {
        var publishResult = childProcess.execSync(npmPublishCommand, {
            cwd: packagePath,
            encoding: "utf-8"
        });
        console.error("publishResult", publishResult);
    }
    catch (e) {
        console.error("发布模块异常", e);
    }
    console.log("\u53D1\u5E03\u6A21\u5757\uFF1A " + npmPublishCommand + "  cwd  " + packagePath);
    packageJson = packageJson.replace(otherRegister, mainRegistry);
    fs.writeFileSync(packageJsonFilePath, packageJson);
}
var lernaConfig = readJsonFile("./lerna.json");
var packages = lernaConfig.packages;
["declarative-api", "dependency-management", "packages", "feign", "starters"].forEach(function (folder) {
    var resolvePath = path.resolve(__dirname, ("../" + folder).replace("\*", ""));
    readFilDirList(resolvePath);
});
