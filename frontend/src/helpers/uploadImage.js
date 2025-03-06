const cloudName = process.env.REACT_APP_CLOUD_NAME_CLOUDINARY;
const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
console.log(cloudName);
const uploadImage  = async(image) => {
    const formData = new FormData()
    formData.append("file",image)
    formData.append("upload_preset","mern_product")
    

    const dataResponse = await fetch(url,{
        method : "post",
        body : formData
    })

    return dataResponse.json()

}

export default uploadImage 