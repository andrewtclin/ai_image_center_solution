import { useHistory } from "react-router-dom";

import logo from "../../assets/logo/smasoftlogo.png";

import { Button } from "antd";
import { AimOutlined } from "@ant-design/icons";

function Start() {
  //#region //* ------ Configuration ------ *//
  const history = useHistory();
  //#endregion

  //#region //* ------ Lifecycle ------ *//

  //#endregion

  return (
    <div className="grid place-items-center">
      <img
        className="object-contain w-56 mt-12"
        src={logo}
        alt="Smasoft Logo"
      />
      <div className="mt-24 mb-12 grid place-items-center">
        <p className="text-2xl font-medium font-sans tracking-widest animate__animated animate__lightSpeedInLeft animate__slow">
          Welcome
        </p>
        <p className="text-2xl font-normal font-sans tracking-widest animate__animated animate__lightSpeedInRight animate__slow">
          to
        </p>
        <p className="text-3xl font-semibold font-sans tracking-widest animate__animated animate__rollIn animate__slower animate__delay-1s">
          Image Factory
        </p>
      </div>

      <div className="mb-12">
        <Button
          type="primary"
          icon={<AimOutlined />}
          onClick={() => history.push("/login")}
        >
          Login
        </Button>
      </div>
    </div>
  );
}

export default Start;
