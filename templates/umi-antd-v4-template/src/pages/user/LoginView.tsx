import React, {useState} from 'react';
import classNames from "classnames";
import styles from "./style.less";
import LoginFrom from './components/login';
import UserCmdDataProvider from './UserCmdDataProvider';
import {Form, Checkbox} from 'antd';

const {UserName, Password, Submit} = LoginFrom;

export interface LoginViewProps {

}


/**
 * 登录页面
 */

const LoginView = (props: LoginViewProps) => {

  const [loading, setLoading] = useState(false);
  const [autoLogin, setAutoLogin] = useState(true);
  const onFinish = (values) => {
    console.log('Success:', values);
    setLoading(true);
    UserCmdDataProvider.login(values).finally(() => {
      setLoading(false);
    })

  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={classNames(styles.main)}>
      <Form
        className={"login"}
        name="用户登录表单"
        initialValues={{
          username: "admin",
          password: "123456"
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <UserName
          name="username"
          placeholder="用户名或手机号码"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <Password
          name="password"
          placeholder="密码（6到16位密码）"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <div>
          <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <a style={{
            float: 'right',
          }}>忘记密码</a>
        </div>


        <Submit loading={loading}>登录</Submit>
      </Form>
    </div>
  );
};

export default LoginView;
