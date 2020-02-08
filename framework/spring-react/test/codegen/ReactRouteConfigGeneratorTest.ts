import ReactRouteConfigGenerator from "../../src/codegen/ReactRouteConfigGenerator";
import * as path from "path";


describe("react route config generator", () => {

    const reactRouteConfigGenerator = new ReactRouteConfigGenerator(["/paegs/**", "/views/**"], path.join(__dirname, "../"));

});
