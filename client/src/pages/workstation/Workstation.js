import Header from "../../containers/header/Header";
import NavigationPanel from "../../containers/workstation/navigationPanel/NavigationPanel";
import WorkPanel from "../../containers/workstation/workPanel/WorkPanel";

function Workstation() {
  return (
    <div className="mb-14" style={{ height: "80vh" }}>
      <Header />

      <div
        className="flex justify-center items-start"
        style={{ height: "100%" }}
      >
        <div className="w-1/3" style={{ height: "100%" }}>
          <NavigationPanel />
        </div>

        <div className="w-2/3" style={{ height: "100%" }}>
          <WorkPanel />
        </div>
      </div>
    </div>
  );
}

export default Workstation;
