import * as fs from "fs";
import * as path from "path";
import * as childProcess from "child_process";

const version = process.env.npm_package_config_version;

const chennhPublishTargetRegistry = "http://nexus.chennh.com/repository/npm/";

const mainPublishTargetRegistry = "http://nexus.oaknt.com:18081/repository/oak_npm_hosted/";

function readJsonFile(filepath: string) {

    const text = fs.readFileSync(filepath, "utf-8");

    return JSON.parse(text);
}


function isNpmProject(dirPath: string) {

    return fs.existsSync(`${dirPath}/package.json`)
}

//获取文件目录列表
function readFilDirList(projectPath: string) {

    console.log("projectPath", projectPath);
    const dirs = fs.readdirSync(projectPath);

    dirs.map(dir => {
        return path.join(projectPath, dir);
    }).filter(dir => {
        return fs.statSync(dir).isDirectory();
    }).forEach(targetDir => {
        if (isNpmProject(targetDir)) {
            console.log("targetDir", targetDir);
            replacePrivateRegistry(targetDir, mainPublishTargetRegistry, chennhPublishTargetRegistry);
        } else {
            readFilDirList(targetDir);
        }

    });
}

const fixedVersion = '"version": "1.0.3"';
const targetVersion = '"version": "1.0.4"';

/**
 * 替换发布的仓库
 * @param packagePath
 * @param mainRegistry
 * @param otherRegister
 */
function replacePrivateRegistry(packagePath: string,
                                mainRegistry: string,
                                otherRegister: string) {

    const packageJsonFilePath = path.join(packagePath, "./package.json");
    let packageJson = fs.readFileSync(packageJsonFilePath, "utf-8");
    packageJson = packageJson.replace(mainRegistry, otherRegister);
    packageJson = packageJson.replace(fixedVersion, targetVersion);
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
    packageJson = packageJson.replace(targetVersion, fixedVersion);
    fs.writeFileSync(packageJsonFilePath, packageJson);
}

const lernaConfig = readJsonFile("./lerna.json");

const packages = lernaConfig.packages;
["declarative-api", "dependency-management", "packages", "feign", "starters"].forEach((folder) => {
    const resolvePath = path.resolve(__dirname, `../${folder}`.replace("\*", ""));
    readFilDirList(resolvePath);
});

