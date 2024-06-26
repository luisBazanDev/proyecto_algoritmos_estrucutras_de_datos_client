import { useContext } from "react";
import AppContext from "../contexts/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSpinner, faStop } from "@fortawesome/free-solid-svg-icons";

function ControlsComponent({
  sort = false,
  search = false,
  onStart = () => {},
  onStop = () => {},
}) {
  const { dataState } = useContext(AppContext);
  const cancel = dataState === "READY" ? false : true;
  const loading =
    dataState === "LOADING" || dataState === "PROCESSING" ? true : false;

  const handdlerStart = () => {
    onStart();
  };

  return (
    <div className="grid grid-cols-2 justify-center px-2 py-1 gap-2 max-h-1/0 text-black text-sm">
      <div
        className={
          "font-bold py-2 px-3 text-center w-auto cursor-pointer select-none " +
          (loading
            ? "bg-green-600"
            : "bg-green-400 hover:bg-green-500 active:bg-green-600")
        }
        onClick={onStart}
      >
        {loading && (
          <FontAwesomeIcon
            icon={faSpinner}
            className="mr-2 spin-animation-linear"
          />
        )}
        {!loading && <FontAwesomeIcon icon={faPlay} className="mr-2" />}Start
      </div>
      <div
        className={
          "font-bold py-2 px-3 text-center w-auto cursor-pointer select-none " +
          (!cancel
            ? "cursor-default bg-gray-500"
            : "bg-red-400 hover:bg-red-500 active:bg-red-600")
        }
        onClick={onStop}
      >
        <FontAwesomeIcon icon={faStop} className="mr-2" />
        Stop
      </div>
    </div>
  );
}

export default ControlsComponent;
