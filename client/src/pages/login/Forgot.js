import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  credentialsStateReset,
  forgetPasswordStart,
} from "../../redux/modules/credentials/credentials-actions";
import { selectForgetCredentials } from "../../redux/modules/credentials/credentials-selectors";

import logo from "../../assets/logo/smasoftlogo.png";
import { Form, Input, Button } from "antd";
import {
  MailOutlined,
  QuestionOutlined,
  UserOutlined,
} from "@ant-design/icons";

function Forgot() {
  //#region //* ------ Configuration ------ *//
  const history = useHistory();
  const dispatch = useDispatch();
  const forgetInfo = useSelector(selectForgetCredentials);
  //#endregion

  //#region //* ------ Functions ------ *//
  const onForgot = (values) => {
    dispatch(forgetPasswordStart(values));
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
        <QuestionOutlined
          className="text-xl bg-blue-800 bg-opacity-80 p-3 rounded-full"
          style={{ color: "white" }}
        />
        <p className="text-lg pt-3 ml-2 font-semibold">Forgot Password</p>
      </div>
      {forgetInfo?.isLoading === false &&
      forgetInfo?.error === null &&
      forgetInfo?.sentInfo === true ? (
        <div className="grid place-items-center mt-10">
          <p className="text-lg font-semibold">Password Reset Request Sent</p>
          <p className="text-base m-2 mb-5">
            A password reset information was sent to your email address.
            <br />
            Please follow the instructions provided to reset your password.
          </p>
          <p className="text-sm m-4 mb-5 ">
            If you did not receive the reset information within a few moments,
            please check your spam folder or contact us for help.
          </p>
          <Button
            className="mt-5 mb-10"
            type="primary"
            onClick={() => history.push("/login")}
          >
            Back
          </Button>
        </div>
      ) : (
        <Form
          className="grid place-items-center"
          initialValues={{
            remember: true,
          }}
          onFinish={onForgot}
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
            <Input prefix={<UserOutlined />} placeholder="Account" />
          </Form.Item>
          {forgetInfo?.isLoading === false && forgetInfo?.error !== null ? (
            <p className="font-semibold text-red-600">
              {forgetInfo?.error.toString()}
            </p>
          ) : (
            ""
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-60 mt-5">
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

export default Forgot;
