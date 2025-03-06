import React from "react";

const UploadButton = ({ text, handleChange, fileTypes, multiple }) => {
  return (
    <label className="w-full flex flex-row gap-2 items-center justify-center py-3 my-2 bg-transparent rounded-full shadow border-2 border-bw-blue-300 hover:border-bw-blue-500 cursor-pointer select-none">
      <span className="text-bw-blue-500 text-base leading-normal font-semibold">
        {text}
      </span>
      <img  alt="upload_icon" className="w-16 h-16" />
      <input
        type="file"
        className="hidden"
        accept={fileTypes}
        onChange={(e) => handleChange(e)}
        onClick={(e) => (e.target.value = "")}
        multiple={multiple}
      />
    </label>
  );
};

export default UploadButton;
