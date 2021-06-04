import * as webpack from "webpack";
import {SpringWebpackConfiguration} from "fengwuxp-spring-context/src/configuration/webpack/SpringWebpackConfiguration";

export interface WebpackConfigurationGeneratorOptions extends SpringWebpackConfiguration {

    env?: {}
}


export type WebpackConfigurationGenerator = (options?: WebpackConfigurationGeneratorOptions) => webpack.Configuration;