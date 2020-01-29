import * as fs from "fs";
import * as path from "path";
import * as childProcess from "child_process";

const version = process.env.npm_package_config_version;


const mainPublishTargetRegistry = "http://nexus.oaknt.com:18081/repository/oak_npm_hosted/";

function readJsonFile(filepath: string) {

    const text = fs.readFileSync(filepath, "utf-8");

    return JSON.parse(text);
}

//获取文件目录列表
function readFilDirList(basePath: string) {

    const resolvePath = path.resolve(__dirname, basePath);
    console.log("resolvePath", resolvePath);
    const dirs = fs.readdirSync(resolvePath);

    dirs.forEach(dirPath => {
        const targetDir = path.join(resolvePath, dirPath);
        console.log("targetDir", targetDir);

        replacePrivateRegistry(targetDir);

    });


}

function replacePrivateRegistry(packagePath: string) {


    //发布模块
    const npmPublishCommand = `npm publish  --loglevel=verbose`;

    try {
        const publishResult = childProcess.execSync(npmPublishCommand, {
            cwd: packagePath,
            encoding: "utf-8"
        });
        console.error("publishResult", publishResult);
    } catch (e) {
        console.error("发布模块异常", e);
    }

    console.log(`发布模块： ${npmPublishCommand}  cwd  ${packagePath}`);

}

const lernaConfig = readJsonFile("./lerna.json");

const packages = lernaConfig.packages;
["components", "browsers", "packages", "types", "oak"].forEach((folder) => {

    readFilDirList(`../${folder}`.replace("\*", ""));
});

