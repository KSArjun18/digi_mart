import React, { useEffect, useMemo, useRef, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import Button from "./UI/Button"
import Spinner from "./UI/Spinner"

const ImageUploadModal = ({
  open,
  handleClose,
  image,
  getCroppedImage,
  aspectRatios, 
  setImage
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [originalImage, setOriginalImage] = useState(null)
  
  
  const [displayedImageWidth, setDisplayedImageWidth] = useState(0)
  const [displayedImageHeight, setDisplayedImageHeight] = useState(0)

  
  const [imageOffsetX, setImageOffsetX] = useState(0)
  const [imageOffsetY, setImageOffsetY] = useState(0)

  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCropDisabled, setIsCropDisabled] = useState(false)
  const [showAspectRatios, setShowAspectRatios] = useState(false)
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const dropdownRef = useRef(null);


  const [currentAspectRatio, setCurrentAspectRatio] = useState(null)
  
  const [selectedAspectOption, setSelectedAspectOption] = useState("")

  
  const [cropBox, setCropBox] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  })


  const draggingRef = useRef({
    isDragging: false,
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    handle: null,
  })

  
  useEffect(() => {
    if (!image) return
    setIsSubmitting(false)
    setIsCropDisabled(false); 
    const img = new Image()
    img.onload = () => {
      setOriginalImage(img)
      setIsImageLoading(false)
    }
    img.onerror = (err) => {
      console.error("Error loading image:", err)
      setIsImageLoading(false)
    }
    img.src = image
  }, [image])

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAspectRatios(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowAspectRatios]);



  useEffect(() => {
    if (originalImage && imgRef.current && containerRef.current) {
      requestAnimationFrame(() => {
        const imgRect = imgRef.current.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()
        const displayedW = imgRef.current.clientWidth
        const displayedH = imgRef.current.clientHeight
        setDisplayedImageWidth(displayedW)
        setDisplayedImageHeight(displayedH)
        setImageOffsetX(imgRect.left - containerRect.left)
        setImageOffsetY(imgRect.top - containerRect.top)
      })
    }
  }, [originalImage])

  
  const computedOriginalRatio = useMemo(() => {
    return originalImage
      ? originalImage.naturalWidth / originalImage.naturalHeight
      : null
  }, [originalImage])

  
  const availableAspectRatios = useMemo(() => {
    let ratios =
      aspectRatios && aspectRatios.length > 0
        ? [...aspectRatios]
        : [{ label: "Free", value: null }]

    if (ratios.length > 1 && computedOriginalRatio) {
      
      const hasOriginal = ratios.some(
        (r) => r.label.toLowerCase() === "original"
      )
      if (!hasOriginal) {
        ratios.unshift({ label: "Original", value: computedOriginalRatio })
      }
    }
    return ratios
  }, [aspectRatios, computedOriginalRatio])


  
  const resetCropper = () => {
    if (
      availableAspectRatios[0] &&
      availableAspectRatios[0].label.toLowerCase() === "original"
    ) {
      
      handleAspectRatioChange("Original", computedOriginalRatio)
    } else {
      const defaultAR = availableAspectRatios[0].value
      setCurrentAspectRatio(defaultAR)
      setSelectedAspectOption(availableAspectRatios[0].label)

      if (displayedImageWidth && displayedImageHeight) {
        if (defaultAR) {
          let newWidth = displayedImageWidth
          let newHeight = newWidth / defaultAR
          if (newHeight > displayedImageHeight) {
            newHeight = displayedImageHeight
            newWidth = newHeight * defaultAR
          }
          setCropBox({
            x: (displayedImageWidth - newWidth) / 2,
            y: (displayedImageHeight - newHeight) / 2,
            width: newWidth,
            height: newHeight,
          })
        } else {
          setCropBox({
            x: 0,
            y: 0,
            width: displayedImageWidth,
            height: displayedImageHeight,
          })
        }
      }
    }
  }

  useEffect(() => {
    if (open && image) {
      resetCropper()
    }
    
  }, [open, image, displayedImageWidth, displayedImageHeight])

  
  const handleAspectRatioChange = (label, val) => {
    if (
      label.toLowerCase() === "original" &&
      aspectRatios &&
      aspectRatios.length > 0 &&
      computedOriginalRatio
    ) {
      const presetRatios = aspectRatios.filter(
        (r) => r.value !== null && r.label.toLowerCase() !== "original"
      )
      if (presetRatios.length > 0) {
        let closest = presetRatios[0].value
        let minDiff = Math.abs(presetRatios[0].value - computedOriginalRatio)
        presetRatios.forEach((r) => {
          const diff = Math.abs(r.value - computedOriginalRatio)
          if (diff < minDiff) {
            minDiff = diff
            closest = r.value
          }
        })
        val = closest
      }
    }
    setCurrentAspectRatio(val)
    setSelectedAspectOption(label)

    if (displayedImageWidth && displayedImageHeight) {
      if (val) {
        let newWidth = displayedImageWidth
        let newHeight = newWidth / val
        if (newHeight > displayedImageHeight) {
          newHeight = displayedImageHeight
          newWidth = newHeight * val
        }
        setCropBox({
          x: (displayedImageWidth - newWidth) / 2,
          y: (displayedImageHeight - newHeight) / 2,
          width: newWidth,
          height: newHeight,
        })
      } else {
        setCropBox({
          x: 0,
          y: 0,
          width: displayedImageWidth,
          height: displayedImageHeight,
        })
      }
    }
  }

  
  const handleMouseMove = (e) => {
    if (!draggingRef.current.isDragging && !draggingRef.current.isResizing) return

    e.preventDefault()
    let clientX = e.clientX
    let clientY = e.clientY
    if (e.type === "touchmove") {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    }
    const dx = clientX - draggingRef.current.startX
    const dy = clientY - draggingRef.current.startY

    if (draggingRef.current.isDragging) {
      setCropBox((prev) => {
        let newX = prev.x + dx
        let newY = prev.y + dy
        if (newX < 0) newX = 0
        if (newY < 0) newY = 0
        if (newX + prev.width > displayedImageWidth)
          newX = displayedImageWidth - prev.width
        if (newY + prev.height > displayedImageHeight)
          newY = displayedImageHeight - prev.height
        return { ...prev, x: newX, y: newY }
      })
      draggingRef.current.startX = clientX
      draggingRef.current.startY = clientY
    } else if (draggingRef.current.isResizing) {
      let newWidth = draggingRef.current.startWidth
      let newHeight = draggingRef.current.startHeight
      const ratio = currentAspectRatio

      switch (draggingRef.current.handle) {
        case "right":
          newWidth = draggingRef.current.startWidth + dx
          if (ratio) newHeight = newWidth / ratio
          break
        case "left":
          newWidth = draggingRef.current.startWidth - dx
          if (ratio) newHeight = newWidth / ratio
          break
        case "bottom":
          newHeight = draggingRef.current.startHeight + dy
          if (ratio) newWidth = newHeight * ratio
          break
        case "top":
          newHeight = draggingRef.current.startHeight - dy
          if (ratio) newWidth = newHeight * ratio
          break
        case "bottom-right":
          if (ratio) {
            newWidth = draggingRef.current.startWidth + dx
            newHeight = newWidth / ratio
          } else {
            newWidth = draggingRef.current.startWidth + dx
            newHeight = draggingRef.current.startHeight + dy
          }
          break
        case "top-left":
          if (ratio) {
            newWidth = draggingRef.current.startWidth - dx
            newHeight = newWidth / ratio
          } else {
            newWidth = draggingRef.current.startWidth - dx
            newHeight = draggingRef.current.startHeight - dy
          }
          break
        case "top-right":
          if (ratio) {
            newWidth = draggingRef.current.startWidth + dx
            newHeight = newWidth / ratio
          } else {
            newWidth = draggingRef.current.startWidth + dx
            newHeight = draggingRef.current.startHeight - dy
          }
          break
        case "bottom-left":
          if (ratio) {
            newWidth = draggingRef.current.startWidth - dx
            newHeight = newWidth / ratio
          } else {
            newWidth = draggingRef.current.startWidth - dx
            newHeight = draggingRef.current.startHeight + dy
          }
          break
      }

      const MIN_SIZE = 20
      if (newWidth < MIN_SIZE) {
        newWidth = MIN_SIZE
        if (ratio) newHeight = newWidth / ratio
      }
      if (newHeight < MIN_SIZE) {
        newHeight = MIN_SIZE
        if (ratio) newWidth = newHeight * ratio
      }

      setCropBox((prev) => {
        let newX = prev.x
        let newY = prev.y

        switch (draggingRef.current.handle) {
          case "left":
          case "top-left":
          case "bottom-left":
            newX = prev.x + (prev.width - newWidth)
            break
        }
        switch (draggingRef.current.handle) {
          case "top":
          case "top-left":
          case "top-right":
            newY = prev.y + (prev.height - newHeight)
            break
        }

        if (newX < 0) newX = 0
        if (newY < 0) newY = 0
        if (newX + newWidth > displayedImageWidth)
          newWidth = displayedImageWidth - newX
        if (newY + newHeight > displayedImageHeight)
          newHeight = displayedImageHeight - newY

        if (currentAspectRatio) {
          const widthFromHeight = newHeight * currentAspectRatio
          const heightFromWidth = newWidth / currentAspectRatio
          if (newY + heightFromWidth <= displayedImageHeight) {
            newHeight = heightFromWidth
          } else if (newX + widthFromHeight <= displayedImageWidth) {
            newWidth = widthFromHeight
          } else {
            if (newX + widthFromHeight > displayedImageWidth) {
              newWidth = displayedImageWidth - newX
              newHeight = newWidth / currentAspectRatio
            }
            if (newY + heightFromWidth > displayedImageHeight) {
              newHeight = displayedImageHeight - newY
              newWidth = newHeight * currentAspectRatio
            }
          }
        }
        return {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        }
      })
    }
  }
  const getAspectRatioIcon = (label) => {
    switch (label) {
      case "Original":
        return (
          <svg aria-label="Photo outline icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
            <title>Photo outline icon</title>
            <path d="M6.549 5.013A1.557 1.557 0 1 0 8.106 6.57a1.557 1.557 0 0 0-1.557-1.557Z" fillRule="evenodd"></path>
            <path d="m2 18.605 3.901-3.9a.908.908 0 0 1 1.284 0l2.807 2.806a.908.908 0 0 0 1.283 0l5.534-5.534a.908.908 0 0 1 1.283 0l3.905 3.905" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
            <path d="M18.44 2.004A3.56 3.56 0 0 1 22 5.564h0v12.873a3.56 3.56 0 0 1-3.56 3.56H5.568a3.56 3.56 0 0 1-3.56-3.56V5.563a3.56 3.56 0 0 1 3.56-3.56Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
        )
      case "1:1":
        return (
          <svg aria-label="Crop square icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
            <title>Crop square icon</title>
            <path d="M19 23H5a4.004 4.004 0 0 1-4-4V5a4.004 4.004 0 0 1 4-4h14a4.004 4.004 0 0 1 4 4v14a4.004 4.004 0 0 1-4 4ZM5 3a2.002 2.002 0 0 0-2 2v14a2.002 2.002 0 0 0 2 2h14a2.002 2.002 0 0 0 2-2V5a2.002 2.002 0 0 0-2-2Z"></path>
          </svg>
        )
      case "16:9":
        return (
          <svg aria-label="Crop landscape icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
            <title>Crop landscape icon</title>
            <path d="M19 20H5a4.004 4.004 0 0 1-4-4V8a4.004 4.004 0 0 1 4-4h14a4.004 4.004 0 0 1 4 4v8a4.004 4.004 0 0 1-4 4ZM5 6a2.002 2.002 0 0 0-2 2v8a2.002 2.002 0 0 0 2 2h14a2.002 2.002 0 0 0 2-2V8a2.002 2.002 0 0 0-2-2Z"></path>
          </svg>
        )
      case "4:5":
        return (
          <svg aria-label="Crop portrait icon" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
            <title>Crop portrait icon</title>
            <path d="M16 23H8a4.004 4.004 0 0 1-4-4V5a4.004 4.004 0 0 1 4-4h8a4.004 4.004 0 0 1 4 4v14a4.004 4.004 0 0 1-4 4ZM8 3a2.002 2.002 0 0 0-2 2v14a2.002 2.002 0 0 0 2 2h8a2.002 2.002 0 0 0 2-2V5a2.002 2.002 0 0 0-2-2Z"></path>
          </svg>
        )
      default:
        return null
    }
  }
  
  const handleMouseUp = () => {
    draggingRef.current.isDragging = false
    draggingRef.current.isResizing = false
    draggingRef.current.handle = null
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchmove", handleMouseMove, { passive: false })
    window.addEventListener("touchend", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleMouseMove)
      window.removeEventListener("touchend", handleMouseUp)
    }
  }, [displayedImageWidth, displayedImageHeight, currentAspectRatio])

  const handleMouseDownOnCropBox = (e) => {
    if (isCropDisabled) return
    if (isSubmitting) return
    e.preventDefault()
    let clientX = e.clientX
    let clientY = e.clientY
    if (e.type === "touchstart") {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    }
    draggingRef.current.isDragging = true
    draggingRef.current.startX = clientX
    draggingRef.current.startY = clientY
  }

  const handleResizeHandleDown = (e, handle) => {
    if (isSubmitting) return
    e.preventDefault()
    e.stopPropagation()
    let clientX = e.clientX
    let clientY = e.clientY
    if (e.type === "touchstart") {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    }
    draggingRef.current.isResizing = true
    draggingRef.current.startX = clientX
    draggingRef.current.startY = clientY
    draggingRef.current.startWidth = cropBox.width
    draggingRef.current.startHeight = cropBox.height
    draggingRef.current.handle = handle
  }
  useEffect(() => {
    if(aspectRatios)return
    setIsCropDisabled(!!aspectRatios);
  }, [aspectRatios]);
  const handleDone = async () => {
    if (!originalImage || !imgRef.current) return
    setIsSubmitting(true)
    setIsCropDisabled(true)

    const imgElement = imgRef.current
    const originalWidth = imgElement.naturalWidth
    const originalHeight = imgElement.naturalHeight
    const displayedWidth = Math.round(imgElement.clientWidth)
    const displayedHeight = Math.round(imgElement.clientHeight)

    const scaleX = originalWidth / displayedWidth
    const scaleY = originalHeight / displayedHeight

    let sx = Math.round(cropBox.x * scaleX)
    let sy = Math.round(cropBox.y * scaleY)
    let sWidth = Math.round(cropBox.width * scaleX)
    let sHeight = Math.round(cropBox.height * scaleY)

    sx = Math.max(0, Math.min(originalWidth - 1, sx))
    sy = Math.max(0, Math.min(originalHeight - 1, sy))
    sWidth = Math.min(originalWidth - sx, sWidth)
    sHeight = Math.min(originalHeight - sy, sHeight)

    const canvas = document.createElement("canvas")
    canvas.width = sWidth
    canvas.height = sHeight
    const ctx = canvas.getContext("2d")
    ctx.drawImage(originalImage, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

    const croppedImageData = canvas.toDataURL("image/png")
    await getCroppedImage(croppedImageData)
    setIsSubmitting(false)
  }

  const handleConfirm = () => {
    handleClose()
  }

  // Renders the eight resize handles (if not currently submitting)
  const renderResizeHandles = () => {
    if (isSubmitting) return null;
    return (
      <>
        {[ 
          { position: "top-left", cursor: "nwse-resize", borderWidth: "4px 0 0 4px", borderRadius: "8px 0 0 0" },
          { position: "top-right", cursor: "nesw-resize", borderWidth: "4px 4px 0 0", borderRadius: "0 8px 0 0" },
          { position: "bottom-left", cursor: "nesw-resize", borderWidth: "0 0 4px 4px", borderRadius: "0 0 0 8px" },
          { position: "bottom-right", cursor: "nwse-resize", borderWidth: "0 4px 4px 0", borderRadius: "0 0 8px 0" }
        ].map(({ position, cursor, borderWidth, borderRadius }) => (
          <div
            key={position}
            style={{
              position: "absolute",
              width: "20px",
              height: "20px",
              borderColor: "#009EE5",
              borderStyle: "solid",
              borderWidth,
              borderRadius,
              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
              cursor,
              [position.includes("top") ? "top" : "bottom"]: "-5px",
              [position.includes("left") ? "left" : "right"]: "-5px",
            }}
            onMouseDown={(e) => handleResizeHandleDown(e, position)}
            onTouchStart={(e) => handleResizeHandleDown(e, position)}
          />
        ))}
       
      </>
    );
  };


  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 fixed inset-0 z-[57]" />
        <Dialog.Content className="shadow-2xl fixed top-1/2 left-1/2 max-h-[100vh] w-[90vw] max-w-[500px] transform -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white z-[59]">
          <Dialog.Title className="px-4 py-3 lg:text-2xl text-base font-medium flex justify-between">
            Crop Image
          </Dialog.Title>
          <Dialog.Description className="text-[16px] min-h-[400px] leading-normal text-center relative flex items-center justify-center">
          {isImageLoading ? (
  <div className="bg-white flex items-center justify-center h-[400px]">
    <Spinner size={8} />
  </div>
) : (
  <div
    ref={containerRef}
    className="relative w-full h-[400px] overflow-hidden flex items-center justify-center bg-gray-200"
  >
    <img
      ref={imgRef}
      src={image || "/placeholder.svg"}
      alt="To crop"
      className="max-w-full max-h-full object-contain"
    />

    {/* Render overlays and crop box only if the displayed dimensions are known */}
    {displayedImageWidth > 0 && displayedImageHeight > 0 && (
      <>
        {/* Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-full bg-black bg-opacity-50"
            style={{ height: imageOffsetY + cropBox.y }}
          />
          <div
            className="absolute left-0 bg-black bg-opacity-50"
            style={{
              top: imageOffsetY + cropBox.y,
              width: imageOffsetX + cropBox.x,
              height: cropBox.height,
            }}
          />
          <div
            className="absolute right-0 bg-black bg-opacity-50"
            style={{
              top: imageOffsetY + cropBox.y,
              left: imageOffsetX + cropBox.x + cropBox.width,
              width: `calc(100% - ${imageOffsetX + cropBox.x + cropBox.width}px)`,
              height: cropBox.height,
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50"
            style={{
              top: imageOffsetY + cropBox.y + cropBox.height,
              height: `calc(100% - ${imageOffsetY + cropBox.y + cropBox.height}px)`,
            }}
          />
        </div>

        {/* Crop Box */}
        <div
          className="absolute border border-white rounded-md shadow-lg flex items-center justify-center"
          style={{
            top: `${imageOffsetY + cropBox.y}px`,
            left: `${imageOffsetX + cropBox.x}px`,
            width: `${cropBox.width}px`,
            height: `${cropBox.height}px`,
            cursor: draggingRef.current.isResizing ? "default" : "move",
          }}
          onMouseDown={handleMouseDownOnCropBox}
          onTouchStart={handleMouseDownOnCropBox}
        >
          {renderResizeHandles()}
        </div>
      </>
    )}
  </div>
)
}
            <div className="flex gap-3 absolute bottom-3 z-5 left-3">
              <div className="relative" ref={dropdownRef}>
              {aspectRatios && showAspectRatios && (
                   <div className="bg-black/70 rounded-lg absolute bottom-8 mb-1.5">
                    {availableAspectRatios.length > 1 ||
                    (availableAspectRatios[0] && availableAspectRatios[0].value !== null) ? (
                      availableAspectRatios.map((ar) => (
                        <React.Fragment key={ar.label}>
                          <section
                            className={`px-4 py-2 flex gap-3 text-sm items-center cursor-pointer ${
                              selectedAspectOption === ar.label
                                ? "text-bw-primary-400"
                                : "text-white opacity-50 hover:opacity-100"
                            }`}
                            onClick={() => handleAspectRatioChange(ar.label, ar.value)}
                          >
                            <p>{ar.label}</p>
                            {getAspectRatioIcon(ar.label)}
                          </section>
                          <div className="border-t-[0.2px] opacity-30 border-white"></div>
                        </React.Fragment>
                      ))
                    ) : null}
                  </div> 
                )}
               {aspectRatios  && (
                     <div
                     onClick={() => setShowAspectRatios((prev) => !prev)}
                     className={`bg-white rounded-full p-1 h-7 w-7 flex items-center justify-center shadow-400`}
                   >
                     <svg
                       aria-label="Select crop"
                       fill="currentColor"
                       height="16"
                       role="img"
                       viewBox="0 0 24 24"
                       width="16"
                     >
                       <title>Select crop</title>
                       <path d="M10 20H4v-6a1 1 0 0 0-2 0v7a1 1 0 0 0 1 1h7a1 1 0 0 0 0-2ZM20.999 2H14a1 1 0 0 0 0 2h5.999v6a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1Z"></path>
                     </svg>
                   </div>
                )}
                
              </div>
            </div>
          </Dialog.Description>

          <div className="flex gap-16 pt-5 px-4 justify-between">
            <Button
              text="Reset"
              onClick={resetCropper}
              active={!isSubmitting && !isCropDisabled}
              padding="py-3 px-5"
              isTransparent={true}
            />
            <Button
              text="Done"
              active={!isSubmitting && !isCropDisabled}
              onClick={handleDone}
              padding="py-3 px-5"
              isTransparent={false}
              loader={isSubmitting || isCropDisabled}
            />
          </div>
          <Dialog.Close>
            <button
              className="text-bw-blue-500 hover:bg-bw-blue-100 focus:shadow-bw-blue-400 absolute top-[15px] right-[15px] inline-flex h-[25px] w-[25px] items-center justify-center rounded-full"
              aria-label="Close"
              onClick={() => {handleConfirm()
                
              }}
            >
              ✖
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
     
    </Dialog.Root>
  )
}

export default ImageUploadModal