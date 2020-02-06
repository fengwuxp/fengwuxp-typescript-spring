export interface LoginUserInfo {


  id: number;


  /**
   * 姓名
   */
  name: string;

  /**
   * 昵称
   */
  nickName: string;

  avatar?:string;

  /**
   * 手机号码
   */
  mobilePhone: string;

  /**
   * 邮箱
   */
  email: string;


  /**
   * 是否超管理
   */
  root: string;

  /**
   * token
   */
  token: string;


  /**
   * token失效时间
   */
  tokenExpired: number;

  username: string;

  authorities: any[];

  accountNonExpired: boolean;

  accountNonLocked: boolean;

  credentialsNonExpired: boolean;

  enabled: boolean;
}
