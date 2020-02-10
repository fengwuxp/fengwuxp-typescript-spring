import ReactRouteConfigGenerator, {DEFAULT_CODEGEN_OPTIONS} from "../../src/codegen/ReactRouteConfigGenerator";
import * as path from "path";
import * as fs from "fs";
import teconfig from "../../tsconfig.test.json";
import UmiReactRouteConfigGenerator from "../../src/codegen/umi/UmiReactRouteConfigGenerator";

describe("react route config generator", () => {


    test("test react route config", () => {

        const reactRouteConfigGenerator = new ReactRouteConfigGenerator(
            ["/test/example/pages/**", "/test/example/views/**"],
            teconfig.compilerOptions,
            {
                ...DEFAULT_CODEGEN_OPTIONS,
                excludeFiles: [
                   // path.normalize( `${fs.realpathSync(process.cwd())}/test/example/pages/example/**`)
                ]
            }
        );
        reactRouteConfigGenerator.generate();

    });

    test("test umi route config", () => {
        const reactRouteConfigGenerator = new UmiReactRouteConfigGenerator(
            ["/test/example/pages/**", "/test/example/views/**"], teconfig.compilerOptions);
        reactRouteConfigGenerator.generate();

    })
});
