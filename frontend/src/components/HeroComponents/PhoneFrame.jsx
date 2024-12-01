import React from "react";
import frame from "./images/eKYC.png";
import "./css/phoneFrame.css";

const PhoneFrame = () => {
  return (
    <div className="relative flex justify-center items-center aspect-[366/729]">
      <img
        src={frame}
        alt="frame"
        className="absolute top-12 left-[80px] h-auto w-auto object-contain bounce-animation"
      />
    </div>
  );
};

export default PhoneFrame;
