"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var childProcess = require("child_process");
var version = process.env.npm_package_config_version;
var mainPublishTargetRegistry = "http://nexus.oaknt.com:18081/repository/oak_npm_hosted/";
function readJsonFile(filepath) {
    var text = fs.readFileSync(filepath, "utf-8");
    return JSON.parse(text);
}
//获取文件目录列表
function readFilDirList(basePath) {
    var resolvePath = path.resolve(__dirname, basePath);
    console.log("resolvePath", resolvePath);
    var dirs = fs.readdirSync(resolvePath);
    dirs.forEach(function (dirPath) {
        var targetDir = path.join(resolvePath, dirPath);
        console.log("targetDir", targetDir);
        replacePrivateRegistry(targetDir);
    });
}
var fixedVersion = '"version": "1.0.0"';
var targetVersion = '"version": "1.0.3"';
function replacePrivateRegistry(packagePath) {
    var packageJsonFilePath = path.join(packagePath, "./package.json");
    try {
        var packageJson = fs.readFileSync(packageJsonFilePath, "utf-8");
        packageJson = packageJson.replace(fixedVersion, targetVersion);
        fs.writeFileSync(packageJsonFilePath, packageJson);
    }
    catch (e) {
        return;
    }
    //发布模块
    var npmPublishCommand = "npm run publish:lib  --loglevel=verbose";
    // const npmPublishCommand = `npm publish  --loglevel=verbose`;
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
}
var lernaConfig = readJsonFile("./lerna.json");
var packages = lernaConfig.packages;
["feign", "framework", "starters"].forEach(function (folder) {
    readFilDirList(("../" + folder).replace("\*", ""));
});
