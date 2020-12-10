import 'zone.js'

const rootZone = Zone.current;
const zoneA = rootZone.fork({name: 'A'});

expect(Zone.current).toBe(rootZone);

describe("test zone", () => {
    test("zone.js example", () => {
        setTimeout(function timeoutCb1() {
            // 此回调在 rootZone 中执行
            expect(Zone.current).toEqual(rootZone);
        }, 0);

        // 执行 run 方法，将切换 Zone.current 所保存的 Zone
        zoneA.run(function run1() {
            expect(Zone.current).toEqual(zoneA);

            // setTimeout 在 zoneA 中被调用
            setTimeout(function timeoutCb2() {
                // 此回调在 zoneA 中执行
                expect(Zone.current).toEqual(zoneA);
            }, 0);
        });

        // 退出 zoneA.run 后，将切换回之前的 Zone
        expect(Zone.current).toBe(rootZone);
    })
})