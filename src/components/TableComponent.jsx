import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import AppContext from "../contexts/AppContext";
import { fetchData } from "../utils/fetchData";

function TableComponent() {
  const [pointerCell, setPointerCell] = useState([0, 0]); // [x, y]
  const {
    page,
    data,
    setPage,
    lastSearch,
    setLastSearch,
    token,
    setData,
    dataState,
    setDataState,
  } = useContext(AppContext);

  const handleMouseMove = (e) => {
    const x = e.target.cellIndex;
    const y = e.target.parentNode.rowIndex;
    // console.log("Cell:", x, y);
    setPointerCell([x, y]);
  };

  const handlePageChange = (howPage) => {
    if (lastSearch !== -1) setLastSearch(-1);

    const newPage = ((howPage) => {
      if (howPage === "prev" && page.now > 1) {
        return { now: page.now - 1, total: page.total };
      } else if (howPage === "next" && page.now < page.total) {
        return { now: page.now + 1, total: page.total };
      } else if (
        typeof howPage === "number" &&
        howPage > 0 &&
        howPage <= page.total
      ) {
        return { now: howPage, total: page.total };
      }
    })(howPage);

    setPage(newPage);

    console.log(newPage);

    fetchData({
      token,
      pageLocal: newPage,
      setLastSearch,
      setPage,
      dataState,
      setData,
      setDataState,
    });
  };

  // data is a array of objects
  return data !== null ? (
    <div className="flex-1 h-5/6 w-full bg-neutral-200">
      <div className="max-h-full h-[95%] w-full overflow-scroll">
        <table className="max-h-full min-w-full w-max">
          <thead>
            <tr className="min-w-max sticky">
              <th className="border-2 border-black bg-gray-300">Index</th>
              {data.length === 0 ? (
                <th>No data</th>
              ) : (
                // Object.keys(data[0]) returns an array of keys from the first object in the data array
                Object.keys(data[0]).map((item, index) => (
                  <th
                    key={index}
                    className={
                      "border-2 border-black transition-transform " +
                      (pointerCell[0] === index + 1
                        ? "bg-orange-600"
                        : "bg-yellow-600")
                    }
                  >
                    {item}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {
              // data is an array of objects
              data.map((item, indexY) => (
                <tr key={"row-" + indexY} className="h-max">
                  <td
                    className={
                      "border-2 border-black transition-transform " +
                      (pointerCell[1] === indexY + 1
                        ? "bg-gray-400"
                        : "bg-gray-300")
                    }
                  >
                    {indexY + 1}
                  </td>
                  {
                    // Object.values(item) returns an array of values from the object
                    Object.values(item).map((value, indexX) => (
                      <td
                        key={"cell-" + indexY + indexX}
                        className={
                          "border-2 border-black" +
                          (indexY + (page.now - 1) * 50 === lastSearch
                            ? " bg-pink-400"
                            : "")
                        }
                        onMouseMove={handleMouseMove}
                      >
                        {value}
                      </td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div className="h-[5%] w-full flex justify-center bg-gray-900">
        <div className="flex text-white text-lg border-e-black">
          <div
            className="px-2 min-w-8 cursor-pointer select-none text-center hover:bg-cyan-700 active:bg-cyan-900"
            onClick={() => {
              handlePageChange("prev");
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <div
            className={
              "px-2 min-w-8 cursor-pointer select-none text-center hover:bg-cyan-700 active:bg-cyan-900 " +
              (page.now === 1 ? "bg-cyan-700" : "")
            }
            onClick={() => {
              handlePageChange(page.now === 1 ? 1 : page.now - 1);
            }}
          >
            {page.now === 1 ? 1 : page.now - 1}
          </div>
          <div
            className={
              "px-2 min-w-8 cursor-pointer select-none text-center hover:bg-cyan-700 active:bg-cyan-900 " +
              (page.now !== 1 ? "bg-cyan-700" : "")
            }
            onClick={() => {
              handlePageChange(page.now === 1 ? page.now + 1 : page.now);
            }}
          >
            {page.now === 1 ? page.now + 1 : page.now}
          </div>
          <div
            className={
              "px-2 min-w-8 cursor-pointer select-none text-center hover:bg-cyan-700 active:bg-cyan-900 " +
              (page.now + 1 >= page.total ? "hidden" : "")
            }
            onClick={() => {
              handlePageChange(page.now === 1 ? page.now + 2 : page.now + 1);
            }}
          >
            {page.now === 1 ? page.now + 2 : page.now + 1}
          </div>
          <div
            className={
              "px-2 min-w-8 cursor-pointer select-none text-center hover:bg-cyan-700 active:bg-cyan-900 " +
              (page.now + 2 >= page.total ? "hidden" : "")
            }
          >
            ...
          </div>
          <div
            className={
              "px-2 min-w-8 cursor-pointer select-none text-center hover:bg-cyan-700 active:bg-cyan-900 " +
              (page.now >= page.total ? "hidden" : "")
            }
            onClick={() => {
              handlePageChange(page.total);
            }}
          >
            {page.total}
          </div>
          <div
            className="px-2 w-8 cursor-pointer hover:bg-cyan-700 active:bg-cyan-900 "
            onClick={() => {
              handlePageChange("next");
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex-1 flex flex-col justify-center items-center h-5/6 w-full bg-neutral-200 text-black">
      <FontAwesomeIcon
        icon={faSpinner}
        className="spin-animation text-2xl text-green-700"
      />
      <span className="text-2xl">
        Server is now reading your data,{" "}
        <span className="text-green-700">please wait...</span>
      </span>
    </div>
  );
}

export default TableComponent;
