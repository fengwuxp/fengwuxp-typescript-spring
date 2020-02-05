import {CmdDataProvider, CmdProviderMethod} from "fengwuxp-event-state";
import UserService from "@/feign/user/UserService";
import {saveLoginUser} from "@/SessionManager";
import {LoginReq} from "@/feign/user/req/LoginReq";


@CmdDataProvider({
  eventName: "login"
})
class UserCmdDataProvider {


  @CmdProviderMethod({
    propName: "loginUser"
  })
  login = (req: LoginReq): Promise<any> => {

    return UserService.login(req, {useProgressBar: false}).then((user) => {
      saveLoginUser(user);
      return user;
    });
  };


}

export default new UserCmdDataProvider();

