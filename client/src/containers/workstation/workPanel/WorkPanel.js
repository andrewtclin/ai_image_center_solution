import ActionBar from "./actionBar/ActionBar";
import ImageBrowser from "./imageBrowser/ImageBrowser";

function WorkPanel() {
  return (
    <div className="flex flex-col justify-start items-center h-full">
      <div className="w-full h-1/6 mb-5">
        <ActionBar />
      </div>

      <div className="h-5/6  my-4" style={{ width: "95%" }}>
        <ImageBrowser />
      </div>
    </div>
  );
}

export default WorkPanel;
