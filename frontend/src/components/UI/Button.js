import React from "react";
import ButtonSpinner from "./ButtonSpinner.js";

const Button = ({
  text,
  onClick,
  active,
  isTransparent,
  showUploadIcon,
  padding,
  loader,
  btnClass,
  width
}) => {
  return (
    <button
      className={`${padding || "my-4 py-3 px-4"} rounded-full ${ width ? width: "w-full"} ${active ? "opacity-100 " : "opacity-50 cursor-not-allowed flex items-center justify-center hover:select-none hover:bg-bw-primary-500/90 "} ${loader ? " cursor-not-allowed" : ""} ${isTransparent ? "border-2 bg-white hover:bg-bw-primary-500/5 border-bw-primary-500 hover:border-bw-blue-500 text-bw-primary-500 box-border" : "border-2 border-bw-primary-500 bg-bw-blue-500/90 text-white hover:bg-bw-blue-500"} focus:outline-none focus:border-bw-primary-500 focus:ring-0  bg-black ${btnClass}`}
      onClick={onClick}
      disabled={loader || !active}
    >
      {loader && <ButtonSpinner spinnerClass={'mb-1 mr-1 mt-1'}/>} <span>{text}</span>
    </button>
  );
};

export default Button;
