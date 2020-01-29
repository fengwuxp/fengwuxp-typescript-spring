"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var childProcess = require("child_process");
var version = process.env.npm_package_config_version;
// const chennhPublishTargetRegistry = "http://nexus.chennh.com/repository/npm/";
var npmPublishTargetRegistry = "https://registry.npmjs.org/";
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
        replacePrivateRegistry(targetDir, mainPublishTargetRegistry, npmPublishTargetRegistry);
    });
}
function replacePrivateRegistry(packagePath, mainRegistry, otherRegister) {
    var packageJsonFilePath = path.join(packagePath, "./package.json");
    var packageJson = fs.readFileSync(packageJsonFilePath, "utf-8");
    packageJson = packageJson.replace(mainRegistry, otherRegister);
    fs.writeFileSync(packageJsonFilePath, packageJson);
    //移除模块
    var npmPublishCommand = "npm unpublish --force";
    try {
        var publishResult = childProcess.execSync(npmPublishCommand, {
            cwd: packagePath,
            encoding: "utf-8"
        });
        console.error("publishResult", publishResult);
    }
    catch (e) {
        console.error("移除模块异常", e);
    }
    console.log("\u79FB\u9664\u6A21\u5757\uFF1A " + npmPublishCommand + "  cwd  " + packagePath);
    packageJson = packageJson.replace(otherRegister, mainRegistry);
    fs.writeFileSync(packageJsonFilePath, packageJson);
}
var lernaConfig = readJsonFile("./lerna.json");
var packages = lernaConfig.packages;
["components", "browsers", "packages", "types", "oak"].forEach(function (folder) {
    readFilDirList(("../" + folder).replace("\*", ""));
});
