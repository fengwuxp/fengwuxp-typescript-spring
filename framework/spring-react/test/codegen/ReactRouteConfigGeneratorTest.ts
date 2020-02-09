import ReactRouteConfigGenerator from "../../src/codegen/ReactRouteConfigGenerator";
import * as path from "path";
import teconfig from "../../tsconfig.test.json";
import UmiReactRouteConfigGenerator from "../../src/codegen/umi/UmiReactRouteConfigGenerator";

describe("react route config generator", () => {




    test("test react route config", () => {
        const reactRouteConfigGenerator = new ReactRouteConfigGenerator(
            ["/test/example/pages/**", "/test/example/views/**"],teconfig.compilerOptions);
        reactRouteConfigGenerator.generate();

    });

    test("test umi route config", () => {
        const reactRouteConfigGenerator = new UmiReactRouteConfigGenerator(
            ["/test/example/pages/**", "/test/example/views/**"],teconfig.compilerOptions);
        reactRouteConfigGenerator.generate();

    })
});
