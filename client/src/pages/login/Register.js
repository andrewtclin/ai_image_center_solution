import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  credentialsStateReset,
  signUpStart,
} from "../../redux/modules/credentials/credentials-actions";
import { selectSignUp } from "../../redux/modules/credentials/credentials-selectors";

import logo from "../../assets/logo/smasoftlogo.png";
import { Button, Form, Input, Popover } from "antd";
import {
  CheckCircleTwoTone,
  FormOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";

function Register() {
  //#region //* ------ Configuration ------ *//
  const history = useHistory();
  const dispatch = useDispatch();
  const signupInfo = useSelector(selectSignUp);

  const [userCredentials, setUserCredentials] = useState({
    account: "",
    email: "",
    password: "",
    mword: "",
  });
  const [visible, setIsVisible] = useState(false);

  //#endregion

  //#region //* ------ Functions ------ *//
  const onInputChange = (e) => {
    const { value, name } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleVisibleChange = (visible) => {
    setIsVisible(visible);
  };

  const onRegisterSubmit = () => {
    dispatch(signUpStart(userCredentials));
  };
  //#endregion

  //#region //* ------ Lifecycle ------ *//
  useEffect(() => {
    dispatch(credentialsStateReset());
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
        <FormOutlined
          className="text-xl bg-blue-800 bg-opacity-80 p-3 rounded-full"
          style={{ color: "white" }}
        />
        <p className="text-lg pt-3 ml-2 font-semibold">Registration</p>
      </div>

      {signupInfo?.isLoading === false &&
      signupInfo?.error === null &&
      signupInfo?.signupSuccess ? (
        <div className="grid place-items-center">
          <div className="flex justify-center items-center">
            <CheckCircleTwoTone
              className="text-3xl mr-2"
              twoToneColor="#52c41a"
              rotate
            />
            <p className="mr-2 font-semibold pt-4">Success</p>
          </div>

          <p className="text-base my-4 mb-6">
            Congratulations, your account has been successfully created.
          </p>
          <Button
            className="mt-5 mb-10"
            type="primary"
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
        </div>
      ) : (
        <Form
          className="grid place-items-center"
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            className="w-72"
            name="email"
            rules={[
              {
                required: true,
                message: "Please fill in your Email Address.",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              type="email"
              placeholder="Email Address"
              name="email"
              onChange={onInputChange}
              allowClear
            />
          </Form.Item>

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
            <Input
              prefix={<UserOutlined />}
              placeholder="Account"
              name="account"
              onChange={onInputChange}
              allowClear
            />
          </Form.Item>
          {signupInfo?.isLoading === false &&
          signupInfo?.error !== null &&
          !signupInfo?.signupSuccess ? (
            <p className="font-semibold text-red-600">{signupInfo?.error}</p>
          ) : (
            ""
          )}
          <Form.Item>
            <Popover
              title={
                <p className="text-red-500 underline grid place-items-center m-0">
                  Please contact Smasoft to continue
                </p>
              }
              content={
                <div className="grid place-items-center">
                  <Input
                    className="m-2"
                    prefix={<LockOutlined />}
                    placeholder="Password"
                    type="password"
                    name="password"
                    onChange={onInputChange}
                    allowClear
                  />
                  <Input
                    className="mb-2 shadow-sm"
                    prefix={<IdcardOutlined />}
                    placeholder="Admin Key"
                    name="mword"
                    allowClear
                    type="password"
                    onChange={onInputChange}
                    addonAfter="Provided by Smasoft"
                  />
                  <Button type="primary" onClick={onRegisterSubmit}>
                    Register
                  </Button>
                </div>
              }
              trigger="click"
              visible={visible}
              onVisibleChange={handleVisibleChange}
            >
              <Button className="w-60 mt-5" type="primary">
                Continue
              </Button>
            </Popover>
          </Form.Item>
          <p>
            Already have an account? Click here to{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => history.push("/login")}
            >
              login
            </span>
            .
          </p>
        </Form>
      )}
    </div>
  );
}

export default Register;
