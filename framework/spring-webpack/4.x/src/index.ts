import * as path from "path";
import {LOGGER} from "fengwuxp-spring-scannner/lib/helper/Log4jsHelper";
import {NODE_MODULES_DIR} from "fengwuxp-spring-scannner/lib/constant/ConstantVar";
import {webpack4ReactConfigurationGenerator} from "./react/Webpack4ReactConfigurationGenerator";
import {loadYmlConfiguration} from "fengwuxp-spring-scannner/lib";


export interface GeneratorWebpackOptions {

    /**
     * default react
     */
    type?: "react" | "vue";

    yamlConfigPath?: string;
}

const DEFAULT_OPTIONS = {
    type: "react"
};

export default function (options: GeneratorWebpackOptions) {


    const {type, yamlConfigPath} = {
        ...options,
        ...DEFAULT_OPTIONS
    };

    //计算项目根路径
    // let projectBasePath = path.resolve(__dirname, "../");
    let projectBasePath = path.resolve("./");
    if (projectBasePath.indexOf(NODE_MODULES_DIR) > 0) {
        projectBasePath = path.resolve(projectBasePath, "../");
    }

    LOGGER.debug("project base path", projectBasePath);

    const springApplicationConfiguration = loadYmlConfiguration(yamlConfigPath || projectBasePath);

    const {webpack, spring} = springApplicationConfiguration;

    const {node} = spring;

    const env = node ? node.env : undefined;
    return webpack4ReactConfigurationGenerator({
        mode: env ? env["NODE_ENV"] : "development",
        ...webpack,
        env,
    });
}