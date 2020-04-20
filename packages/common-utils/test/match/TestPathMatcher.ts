import * as log4js from "log4js";
import AntPathMatcher from "../../src/match/AntPathMatcher";
import SimplePathMatcher from "../../src/match/SimplePathMatcher";


const logger = log4js.getLogger();
logger.level = 'debug';

describe("test path match", () => {


    test("ant path matcher", () => {
        const antPathMatcher = new AntPathMatcher();


        // logger.debug(antPathMatcher.match("/demo/*.tsx", "/demo/a.tsx"));
        // logger.debug(antPathMatcher.match("/demo/*.tsx", "/demo/b/a.tsx"));
        // logger.debug(antPathMatcher.match("/demo/*.tsx", "/demo/b/a.tsx"));
        logger.debug(antPathMatcher.match("/src/pages/**/*.less", "/src/pages/demo/style.less"));

        function match(pattern, paths: string[]) {

            logger.debug(pattern, paths.join("  "), paths.map((path) => {
                return antPathMatcher.match(pattern, path)
            }));
        }

        // match('/path/**/?z', ['/path/x/y/z/xyz', '/path/x/y/z/xyy']);
        // match('/path/**/*z', ['/path/x/y/z/xyz', '/path/x/y/z/xyy']);
        // match('/foo/{id}/bar', ['/foo/1/bar', '/foo/ss/bar', '/foo/1/2/bar']);
        // match('/app/*.x', ['/app/a.x', '/app/a.b']);
        // match('/app/p?ttern', ['/app/pXttern', '/app/pattern', '/app/pttern']);
        // match('/**/example', ['/app/example', '/app/foo/example', '/example', '/app/foo/example1']);
        // match('/app/**/dir/file.', ['/app/dir/file.jsp', '/app/foo/dir/file.html']);
        // match('/**/*.jsp', ['/app/dir/file.jsp', '/app/foo/dir/file.html']);
        // match('/app/**', ['/app/dir/file', '/app/foo/dir/file.html']);
        //
        // match('/foo/{id}/bar', ['/foo/1/bar']);
        // match('/**/example', ['/app/foo/example1']);
        // match('/app/**/example', ["/app/foo/example", "/cpp/foo/example", '/app/foo/example1']);
        // match('/**/*.jsp', ['/app/dir/file.jsp', '/app/foo/dir/file.html']);
        // match('/api/**/user/refreshToken', ['/api/1.0.0/user/refreshToken', '/abc/path1/hhh','/abc/path']);
        match('/api/**/user/authCode', ['/api/1.0.0/user/authCode', '/abc/path1/hhh', '/abc/path']);

    });

    test("simple path matcher", () => {
        const pathMatcher = new SimplePathMatcher();

        function match(pattern, paths: string[]) {

            logger.debug(pattern, paths.join("  "), paths.map((path) => {
                return pathMatcher.match(pattern, path)
            }));
        }

        // match('/path/**', ['http://abc.d/path/x/y/z/xyz', '/paths/x/y/z/xyy']);
        // match('/**/path', ['http://abc.d/abc/path', '/abc/path1','/abc/path/2']);
        // match('/**/path/**', ['http://abc.d/abc/path/test', '/abc/path1/hhh','/abc/path']);
        // match('/api/**/user/refreshToken', ['http://abc.d/api/1.0.0/user/refreshToken', '/abc/path1/hhh','/abc/path']);
        //http://117.50.43.50:52001/app/v1.0/user/login /app/**/user/login
        // match('/app/**/user/login', ['http://xx.xx:52001/app/v1.0/user/login','http://abc.d/app/1.0.0/user/login', '/abc/path1/hhh','/abc/path']);
        match('/app/**/user/authCode', ['http://xx.xx:52001/app/v1.0/user/authCode', 'http://abc.d/app/1.0.0/user/login', '/abc/path1/hhh', '/abc/path']);
    })

    test("simple path matcher 2", () => {
        const pathMatcher = new SimplePathMatcher();

        function match(pattern, paths: string[]) {

            logger.debug(pattern, paths.map((path) => {
                const match = pathMatcher.match(pattern, path);
                if (match) {
                    return path
                }
                return null
            }).filter(item => item != null));
        }

        const paths = [
            "/白色/联通/4G/64",
            "/白色/移动/4G/64",
            "/白色/电信/4G/64",
            "/白色/联通/5G/32",
            "/白色/移动/5G/32",
            "/白色/电信/5G/32",

            "/金色/联通/4G/64",
            "/金色/移动/4G/64",
            "/金色/电信/4G/64",
            "/金色/联通/5G/32",
            "/金色/移动/5G/32",
            "/金色/电信/5G/32",

            "/银白色/联通/4G/64",
            "/银白色/移动/4G/64",
            "/银白色/电信/4G/64",
            "/银白色/联通/5G/32",
            "/银白色/移动/5G/32",
            "/银白色/电信/5G/32",
        ];
        match('/白色/**', paths);
        match('/银白色/**', paths);
        match('/银白色/**/4G', paths);
        match('/**/联通/**', paths);
        match('/**/电信/**', paths);
        match('/**/5G/**', paths);
        match('/**/5G/64', paths);
        match('/**/5G/32', paths);
        match('/金色/**/5G/32', paths);
        match('/金色/**/5G/**', paths);
    })
});

