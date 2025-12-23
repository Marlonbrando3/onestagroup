import React from "react";
import Topoffer from "./topoffer";

type Pop = {
  handlePopUpClosing: any;
};

export default function Topofferslist({ handlePopUpClosing }: Pop) {
  return (
    <div className="h-[550px] overflow-scroll">
      <Topoffer handlePopUpClosing={handlePopUpClosing} />
    </div>
  );
}
