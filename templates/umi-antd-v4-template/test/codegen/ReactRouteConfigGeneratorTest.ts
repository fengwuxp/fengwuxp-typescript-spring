import teconfig from "../../tsconfig.test.json";
import UmiReactRouteConfigGenerator from "fengwuxp-spring-react/esnext/codegen/umi/UmiReactRouteConfigGenerator";
// import {RouteLevel} from "fengwuxp-spring-react/esnext/codegen/umi/UmiCodeGeneratorOptions";


describe("umi antd v4 route config generator", () => {


  test("test umi route config", () => {
    const reactRouteConfigGenerator = new UmiReactRouteConfigGenerator(
      ["/src/pages/**"],
      teconfig.compilerOptions);
    // reactRouteConfigGenerator.setRouteLevel(RouteLevel.THREE)
    reactRouteConfigGenerator.generate();

  })
});
