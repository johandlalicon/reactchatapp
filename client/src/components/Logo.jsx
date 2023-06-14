import React from "react";
import cheeseLogo from "../assets/cheese.svg";

function Logo() {
  return (
    <div className="text-blue-600 font-bold flex gap-2 mb-2">
      <div className="flex gap-2 items-center md:">
        <img src={cheeseLogo} className="w-8 h-8 md:flex-grow" />
      </div>
    </div>
  );
}

export default Logo;
