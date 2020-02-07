import {LoginUserInfo} from "@/feign/user/info/LoginUserInfo";


export interface AntGlobalStateType {

  loginUser: LoginUserInfo;
}


export interface AntDesignGlobalEventNames {

  GLOBAL_USER_LOGIN_EVENT: "GLOBAL_USER_LOGIN_EVENT";
}

export const ANT_DESIGN_GLOBAL_EVENT_NAME: AntDesignGlobalEventNames = {
  GLOBAL_USER_LOGIN_EVENT: "GLOBAL_USER_LOGIN_EVENT"

};
type G<GlobalPropType, GlobalEventTyp> = {

  [key in keyof GlobalPropType]: GlobalEventTyp[keyof GlobalEventTyp]
}

export const ANT_DESIGN_GLOBAL_EVENT_PROP_MAP: G<AntGlobalStateType, AntDesignGlobalEventNames> = {
  loginUser: ANT_DESIGN_GLOBAL_EVENT_NAME.GLOBAL_USER_LOGIN_EVENT
};


