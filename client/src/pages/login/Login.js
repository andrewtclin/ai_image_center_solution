import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  credentialsStateReset,
  signInStart,
} from "../../redux/modules/credentials/credentials-actions";
import { fileSystemReset } from "../../redux/modules/fileSystem/fileSystem-actions";
import { selectSignedIn } from "../../redux/modules/credentials/credentials-selectors";

import logo from "../../assets/logo/smasoftlogo.png";

import { Button, Form, Input } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";

function Login() {
  //#region //* ------ Configuration ------ *//
  const history = useHistory();
  const dispatch = useDispatch();
  const signinInfo = useSelector(selectSignedIn);
  //#endregion

  //#region //* ------ Functions ------ *//
  const onLogin = (values) => {
    dispatch(signInStart(values));
  };
  //#endregion

  //#region //* ------ Lifecycle ------ *//
  useEffect(() => {
    dispatch(credentialsStateReset());
    dispatch(fileSystemReset());
    //eslint-disable-next-line
  }, []);
  //#endregion

  return (
    <div>
      <img
        className="flex flex-col items-center object-contain my-16 mb-14 mx-auto cursor-pointer"
        src={logo}
        alt=""
        onClick={() => history.push("/start")}
      />
      <div className="flex justify-center items-center mb-10">
        <LoginOutlined
          className="text-xl bg-blue-800 bg-opacity-80 p-3 rounded-full "
          style={{ color: "white" }}
        />
        <p className="text-lg pt-3 ml-2 font-semibold">Login</p>
      </div>
      <Form
        className="grid place-items-center"
        initialValues={{
          remember: true,
        }}
        onFinish={onLogin}
      >
        <Form.Item
          className="w-72"
          name="account"
          rules={[
            {
              required: true,
              message: "Please fill in your Account.",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Account" />
        </Form.Item>
        <Form.Item
          className="w-72"
          name="password"
          rules={[
            {
              required: true,
              message: "Please fill in your Password.",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-around w-80 mt-2">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <p
              className="text-blue-600 cursor-pointer"
              onClick={() => history.push("/forgot")}
            >
              Forgot password?
            </p>
          </div>
        </Form.Item>
        {signinInfo?.isLoading === false && signinInfo?.error !== null ? (
          <p className="font-semibold text-red-600">{signinInfo?.error}</p>
        ) : (
          ""
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-64">
            Log in
          </Button>
        </Form.Item>
        <p>
          Don't have an account? Click here to{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => history.push("/register")}
          >
            register
          </span>
          .
        </p>
      </Form>
    </div>
  );
}

export default Login;
