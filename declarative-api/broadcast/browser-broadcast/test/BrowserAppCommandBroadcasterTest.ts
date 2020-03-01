import * as log4js from "log4js";
import {
    AppCommandBroadcaster,
    EmitEventMethod,
    ReceiveEventListenerMethod,
    RemoveEventListenerMethod
} from "fengwuxp-declarative-broadcast-adapter";
import {browserAppCommandBroadcasterFactory} from "../src";


const logger = log4js.getLogger();
logger.level = 'debug';

interface MockAppBroadcaster extends AppCommandBroadcaster {

    sendMemberLogin: EmitEventMethod;

    receiveMemberLogin: ReceiveEventListenerMethod;

    removeMemberLogin: RemoveEventListenerMethod;

}


describe("test browser  app command broadcaster factory", () => {


    const mockAppBroadcaster: MockAppBroadcaster = browserAppCommandBroadcasterFactory();

    test("browser app broadcast", () => {

        const listener = (memberInfo) => {
            logger.debug("接收到用户登录事件", memberInfo);
        };

        mockAppBroadcaster.sendMemberLogin({id: 1, name: "张三"});
        let holder = mockAppBroadcaster.receiveMemberLogin(listener);
        mockAppBroadcaster.sendMemberLogin({id: 2, name: "张三"});
        holder.remove();
        mockAppBroadcaster.sendMemberLogin({id: 3, name: "张三"});
        holder = mockAppBroadcaster.receiveMemberLogin(listener);
        mockAppBroadcaster.sendMemberLogin({id: 4, name: "张三"});
        mockAppBroadcaster.removeMemberLogin(listener);
        mockAppBroadcaster.sendMemberLogin({id: 5, name: "张三"});

    })

});
