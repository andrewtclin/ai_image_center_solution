// import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { portal_port, portal_host } from "../../api/axios/axios";

// import { signOutStart } from "../../redux/modules/credentials/credentials-actions";
// import { selectSignedIn } from "../../redux/modules/credentials/credentials-selectors";

import logo from "../../assets/logo/smasoftlogo.png";

// import { Dropdown, Menu, Divider } from "antd";
// import { AppstoreOutlined, LogoutOutlined } from "@ant-design/icons";
// import Swal from "sweetalert2";

function Workstation() {
  //#region //* ------ CONFIGURATION ------ *//
  // const dispatch = useDispatch();

  // const signedInDetail = useSelector(selectSignedIn);
  //#endregion

  //#region //* ------ Functions ------ *//
  // const handleMenuClick = (e) => {
  //   if (e.key === "0") {
  //     dispatch(signOutStart(signedInDetail?.user?.token));
  //   } else if (e.key === "1") {
  //     Swal.fire({
  //       title: "Back to Portal",
  //       text: "By confirming, you will be redirected back to Portal.",
  //       icon: "info",
  //       showCancelButton: true,
  //       confirmButtonText: "Back",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         window.location.assign(`http://${portal_host}:${portal_port}/`);
  //       }
  //     });
  //   }
  // };
  //#endregion

  return (
    <div
      className="flex items-center justify-between pb-1 bg-gradient-to-tr from-white to-yellow-100 sticky top-0 shadow-sm z-10
     opacity-80"
    >
      <Link to="/index">
        <img
          src={logo}
          alt="Smasoft"
          className="object-contain ml-5  w-12  relative cursor-pointer"
        />
      </Link>

      <div className="flex items-center mr-7 pt-1">
        <p className="mr-1 mt-3 font-medium text-gray-600">Welcome back. </p>

        {/* <Dropdown.Button
          size="small"
          className="mt-1"
          overlay={
            <Menu onClick={handleMenuClick}>
              <Menu.Item key="0">
                <p className="font-medium text-gray-600 m-0">
                  <LogoutOutlined className="mr-1" />
                  Logout
                </p>
              </Menu.Item>
              <div className="m-1">
                <Divider style={{ margin: "0px" }} />
              </div>

              <Menu.Item key="1">
                <p className="font-medium text-gray-600 m-0">
                  <AppstoreOutlined className="mr-1" />
                  Portal
                </p>
              </Menu.Item>
            </Menu>
          }
        /> */}
      </div>
    </div>
  );
}

export default Workstation;
