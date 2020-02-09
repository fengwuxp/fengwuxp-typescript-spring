import teconfig from "../../tsconfig.json";
import UmiReactRouteConfigGenerator
  from "fengwuxp-spring-react/esnext/codegen/umi/UmiReactRouteConfigGenerator";


describe("umi antd v4 route config generator", () => {


  test("test umi route config", () => {
    const reactRouteConfigGenerator = new UmiReactRouteConfigGenerator(
      ["/test/example/pages/**", "/test/example/views/**"], teconfig.compilerOptions);
    reactRouteConfigGenerator.generate();

  })
});
