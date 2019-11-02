import * as log4js from "log4js";
import TestFeignClient from "./TestFeignClient";
import FeignConfigurationRegistry from "../src/configuration/FeignConfigurationRegistry";
import {AbstractBrowserFeignConfiguration} from "../../../boot/feign-boot/src/configuration/AbstractBrowserFeignConfiguration";
import AntPathMatcher from "../src/utils/AntPathMatcher";

class BrowserFeignConfiguration extends AbstractBrowserFeignConfiguration {


    constructor() {
        super();
    }
}

const logger = log4js.getLogger();
logger.level = 'debug';

describe("test feign client", () => {

    FeignConfigurationRegistry.setDefaultFeignConfiguration(new BrowserFeignConfiguration());

    const testFeignClient = new TestFeignClient();


    test("test feign client", async () => {

        const result = await testFeignClient.findMember({
            name: "张三",
            userName: "1",
            memberId: 1
        });
        console.log("http result", result);
    }, 10 * 1000);

    test("test get example", async () => {

        const result = await testFeignClient.getExample({
            id: 1,
            date: new Date(),
            test: "1"
        });
        console.log("http result", result);
    }, 10 * 1000);

    test("test retry", async () => {

        const result = await testFeignClient.testQuery({
            id: 1,
            date: new Date(),
            test: "1"
        });
        console.log("http result", result);
    }, 25 * 1000);

    test("ant path matcher", () => {
        const antPathMatcher = new AntPathMatcher();

        function match(pattern, paths: string[]) {

            logger.debug(pattern, paths.join("  "), paths.map((path) => {
                return antPathMatcher.match(pattern, path)
            }));
        }

        match('/path/**/?z', ['/path/x/y/z/xyz', '/path/x/y/z/xyy']);
        match('/path/**/*z', ['/path/x/y/z/xyz', '/path/x/y/z/xyy']);
        match('/foo/{id}/bar', ['/foo/1/bar', '/foo/ss/bar', '/foo/1/2/bar']);
        match('/app/*.x', ['/app/a.x', '/app/a.b']);
        match('/app/p?ttern', ['/app/pXttern', '/app/pattern', '/app/pttern']);
        match('/**/example', ['/app/example', '/app/foo/example', '/example', '/app/foo/example1']);
        match('/app/**/dir/file.', ['/app/dir/file.jsp', '/app/foo/dir/file.html']);
        match('/**/*.jsp', ['/app/dir/file.jsp', '/app/foo/dir/file.html']);
        match('/app/**', ['/app/dir/file', '/app/foo/dir/file.html']);

        match('/foo/{id}/bar', ['/foo/1/bar']);
        match('/**/example', ['/app/foo/example1']);
        match('/app/**/example', ["/app/foo/example","/cpp/foo/example",'/app/foo/example1']);
        match('/**/*.jsp', ['/app/dir/file.jsp', '/app/foo/dir/file.html']);

    })
});

