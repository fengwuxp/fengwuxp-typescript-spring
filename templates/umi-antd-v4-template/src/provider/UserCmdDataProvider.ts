import {CmdDataProvider} from "fengwuxp-event-state";
import UserService from "@/feign/user/UserService";
import {removeLoginUser, saveLoginUser} from "@/SessionManager";
import {LoginReq} from "@/feign/user/req/LoginReq";


@CmdDataProvider({
  eventName: "login"
})
class UserCmdDataProvider implements StateProvider{


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

