import * as fs from "fs";
import * as path from "path";
import * as childProcess from "child_process";

const version = process.env.npm_package_config_version;

// const chennhPublishTargetRegistry = "http://nexus.chennh.com/repository/npm/";
// yarn add fengwuxp_common_fetch --registry=http://nexus.chennh.com/repository/npm-public --loglevel=verbose
//npm i vma-vue-assist --loglevel=verbose
const npmPublishTargetRegistry = "https://registry.npmjs.org/";

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

        replacePrivateRegistry(targetDir, mainPublishTargetRegistry, npmPublishTargetRegistry);

    });


}

function replacePrivateRegistry(packagePath: string,
                                mainRegistry: string,
                                otherRegister: string) {

    const packageJsonFilePath = path.join(packagePath, "./package.json");
    let packageJson = fs.readFileSync(packageJsonFilePath, "utf-8");
    packageJson = packageJson.replace(mainRegistry, otherRegister);
    fs.writeFileSync(packageJsonFilePath, packageJson);

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

    packageJson = packageJson.replace(otherRegister, mainRegistry);
    fs.writeFileSync(packageJsonFilePath, packageJson);
}

const lernaConfig = readJsonFile("./lerna.json");

const packages = lernaConfig.packages;
["components", "browsers", "packages", "types","oak"].forEach((folder) => {

    readFilDirList(`../${folder}`.replace("\*", ""));
});

