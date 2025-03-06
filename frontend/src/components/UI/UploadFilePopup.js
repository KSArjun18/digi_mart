import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FileUploader } from "react-drag-drop-files";
import UploadButton from "../uiElements/uploadButton";

const UploadFilePopup = ({
  youtubeUrl,
  open,
  handleClose,
  handleUpload,
  idea,
  setFile,file
}) => {
  // const [file, setFile] = useState(null)
  return (
    <div>
      <AlertDialog.Root open={open} onPointerDownOutside={handleClose}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-[57]" onClick={handleClose}/>
          <AlertDialog.Content className={`data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] bg-white   translate-x-[-50%] translate-y-[-50%] max-w-[500px] lg:max-w-[500px] rounded-2xl w-11/12 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[58]`}>
            <div className=" relative flex flex-col gap-3 p-6">
                <div className="flex justify-between">
                  <h1 className="font-medium lg:text-2xl text-base ">{idea?'Add Idea img':'Search by img'}</h1>
                  <img alt="close_icon" src="/images/icons/close.svg"  width={14} height={14} className="cursor-pointer w-3.5 h-3.5" onClick={handleClose}/>
                </div>
            <FileUploader
                  handleChange={ (e) =>{setTimeout(() => handleUpload(e,"userimg"),0);  setFile(e)}}
                  fileOrFiles={file}

                // handleChange={(e) => handleUpload(e, "userimg")}
                name="file"
                types={["JPG", "JPEG", "PNG", "webp"]}
            >
                <div className="lg:border-[2px] lg:border-bw-primary-500 lg:rounded lg:border-dashed das text-center  lg:py-8 h-auto cursor-pointer">
                    <div className=" gap-2 justify-center hidden lg:flex flex-col items-center pt-2">
                        <img
                            src={"/images/icons/uploadImg.svg"}
                            height={50}
                            width={50}
                            alt="img"
                        />
                        <p className="text-bw-typo-950 text-base flex">
                            Drag & Drop an img here 
                        </p>
                        {/* <p className="text-bw-typo-700 text-sm flex">
                          PNG/JPG/WEBP of upto 5 MB
                        </p> */}
                    </div>
                    <p className="text-bw-typo-700 hidden lg:block font-light py-4 text-sm">Or</p>
                    <div className="w-[230px] px-4 mx-auto ">
                      <UploadButton
                        text="Upload img"
                        // handleChange={(e) => handleUpload(e, "userimg")}
                  handleChange={ (e) =>{setTimeout(() => handleUpload(e,'userimg'),0);  setFile(e)}}

                        fileTypes={"image/png, image/jpeg, image/jpg"}
                      />
                      <div className="lg:hidden">
                      <p className="text-sm text-center text-gray-500">PNG/JPG/WEBP</p>
                      </div>
                    </div>
                </div>
            </FileUploader>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export default UploadFilePopup;
