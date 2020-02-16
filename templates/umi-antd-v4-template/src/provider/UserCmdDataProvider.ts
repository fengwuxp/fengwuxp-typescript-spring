import {CmdDataProvider, StateProvider} from "fengwuxp-event-state";
import UserService from "@/feign/user/UserService";
import {getLoginUser, removeLoginUser, saveLoginUser} from "@/SessionManager";
import {LoginReq} from "@/feign/user/req/LoginReq";
import {ANT_DESIGN_GLOBAL_EVENT_NAME} from "@/AntGlobalEventNames";


@CmdDataProvider({
  eventName: ANT_DESIGN_GLOBAL_EVENT_NAME.GLOBAL_USER_LOGIN_EVENT
})
class UserCmdDataProvider implements StateProvider {

  defaultState = () => {
    console.log("初始化用户信息");
    return getLoginUser();
  };

  // @CmdProviderMethod({
  //   propName: "loginUser"
  // })
  login = (req: LoginReq): Promise<any> => {


    return UserService.login(req, {useProgressBar: false}).then((user) => {
      user.avatar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
      saveLoginUser(user);
      return user;
    });
  };

  /**
   * 退出登录
   */
  logout = (): Promise<any> => {
    return UserService.logout({}, {useProgressBar: false}).then(() => {
      removeLoginUser();
    });
  }

}

export default new UserCmdDataProvider();

