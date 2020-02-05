const key = "antd_login_user";

let CACHE_USER = null;

export const saveLoginUser = (loginUser) => {
  CACHE_USER = loginUser;
  localStorage.setItem(key, JSON.stringify(loginUser));
};

export const getLoginUser = () => {

  if (CACHE_USER != null) {
    return CACHE_USER;
  }

  const item = localStorage.getItem(key);
  if (item == null) {
    return null;
  }
  CACHE_USER = JSON.parse(item);
  return CACHE_USER
};


export const removeLoginUser = () => {
  CACHE_USER = null;
  localStorage.removeItem(key);
};
