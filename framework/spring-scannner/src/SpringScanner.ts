import SpringPackageScanner from "./scanner/SpringPackageScanner";
import {FilePathTransformStrategy} from "./strategy/FilePathTransformStrategy";
import DefaultFilePathTransformStrategy from "./strategy/DefaultFilePathTransformStrategy";
import ReactRouteConfigGenerator from "./generator/react/ReactRouteConfigGenerator";
import {DEFAULT_GENERATOR_OUTPUT_DIR} from "./constant/ConstantVar";
import {ScannerConfiguration} from "fengwuxp-spring-context/lib/configuration/scanner/ScannerConfiguration";


export interface ScannerOptions extends ScannerConfiguration {

    //项目根路径
    projectBasePath?: string;
}

export const DEFAULT_SCANNER_OPTIONS: ScannerOptions = {
    scanPackages: ["views"],
    nodeModules: [],
    generateOutputPath: DEFAULT_GENERATOR_OUTPUT_DIR
};


/**
 * 包扫码入口
 * @param options
 */
export default function (options?: ScannerOptions) {


    const scannerOptions = {
        ...DEFAULT_SCANNER_OPTIONS,
        ...(options || {})
    };


    const filePathTransformStrategy: FilePathTransformStrategy = new DefaultFilePathTransformStrategy();

    const springPackageScanner: SpringPackageScanner = new SpringPackageScanner();

    const reactRouteConfigGenerator: ReactRouteConfigGenerator = new ReactRouteConfigGenerator();

    const paths = filePathTransformStrategy.transform(scannerOptions);
    const files = springPackageScanner.scan(paths);

    reactRouteConfigGenerator.generator(files, {
        outputPath: scannerOptions.generateOutputPath,
        projectBasePath: scannerOptions.projectBasePath,
        scanPackages: scannerOptions.scanPackages,
        aliasBasePath: scannerOptions.aliasBasePath,
        aliasConfiguration: scannerOptions.aliasConfiguration
    });

}