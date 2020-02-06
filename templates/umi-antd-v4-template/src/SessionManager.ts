import {LoginUserInfo} from "@/feign/user/info/LoginUserInfo";
import {AppStorage} from "@/BrowserAppStorage";


let CACHE_USER = null;

export const saveLoginUser = (loginUser: LoginUserInfo) => {
  CACHE_USER = loginUser;
  AppStorage.setUserInfo(loginUser);
};

export const getLoginUser = (): LoginUserInfo => {

  if (CACHE_USER != null) {
    return CACHE_USER;
  }

  const userInfo = AppStorage.getUserInfoSync();
  console.log("userInfo", userInfo);
  if (userInfo == null) {
    return null;
  }
  CACHE_USER = userInfo;
  return CACHE_USER
};


export const removeLoginUser = () => {
  CACHE_USER = null;
  AppStorage.removeUserInfo();
};
