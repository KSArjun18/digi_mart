import React, { useContext, useRef, useState } from 'react';
import Logo from './Logo';
import { GrSearch } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import { FaRegCircleUser } from "react-icons/fa6";
import cameraImage from '../assest/banner/camera.svg';
import micImage from '../assest/banner/mic.svg';
import camUpload from '../assest/banner/cameraUpload.png';
import ImageUploadModal from './ImageUploadModal';
import VoiceSearchPopup from './UI/VoiceSearchPopup';
import { correctSpeechErrors } from './UI/SpellingCheck';


const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  const [listening, setListening] = useState(false)
  const [image, setImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const [getCroppedImage,setGetCroppedImagea]=useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  
  const openFileSelector = () => fileInputRef.current.click();
  
  const processImage = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setIsModalOpen(false);
      setShowModal(true);
    }
  };
  
  const handleFileChange = (event) => processImage(event.target?.files[0]);
  
  const handleDrop = (event) => {
    event.preventDefault();
    processImage(event.dataTransfer.files[0]);
  };
  
  const handleCroppedImage = (croppedImage) => {
    setGetCroppedImagea(croppedImage)
    setShowModal(false);
  };
 

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const correctedTranscript = correctSpeechErrors(transcript);
    setListening(false);
    setIsPopupOpen(false);
    navigate(`/search?q=${correctedTranscript}`);
    setSearch(correctedTranscript);
  };

  recognition.onerror = (event) => {
    console.error("Voice search error:", event.error);
    toast.error("Search again");
    setListening(false);
    setIsPopupOpen(false); 
  };

  recognition.onend = () => {
    setListening(false);
  };

  const handleVoiceSearch = () => {
    if (!listening) {
      setListening(true);
      recognition.start();
    } else {
      setListening(false);
      recognition.stop();
    }
  };

  const aspectRatios=[
    { label: "Original", value: null }, 
    { label: "1:1", value: 1 }, 
    { label: "16:9", value: 16 / 9 }, 
    { label: "4:5", value: 4 / 5} 
  ]
 


  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include',
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    navigate(value ? `/search?q=${value}` : "/search");
  };

  const clearInput=(()=>{
    setSearch("");
    setGetCroppedImagea(null);
  })
  

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <div>
          <Link to={'/'} onClick={clearInput}>
            <Logo w={90} h={50} />
          </Link>
        </div>

        <div className="hidden lg:flex items-center w-full max-w-md border rounded-full focus-within:shadow pl-2 relative">
  {getCroppedImage && (
    <img
      src={getCroppedImage}
      alt="Preview"
      className="w-10 h-10 absolute left-2 rounded-lg object-cover cursor-pointer"
      onClick={() => setShowModal(true)}
    />
  )}
<div className=" flex-grow">
    <input
      type="text"
      placeholder="Search product here..."
      className={`w-full outline-none p-2 transition-all rounded-full pr-10 ${
        getCroppedImage ? "pl-14" : "pl-4"
      }`}
      onChange={handleSearch}
      value={search}
    />

    {( getCroppedImage) && (
      <button
        className="absolute left-72 top-1/2 transform -translate-y-1/2  rounded-full p-1 text-gray-600  transition"
        onClick={() => {
          if (getCroppedImage) {
            setGetCroppedImagea(null);
          }
        }}
      >
        ✖
      </button>
    )}
  </div>

          
          
         <div className="flex items-center me-2">
         <button
        title="Voice search"
        className="text-lg cursor-pointer flex items-center justify-center rounded-full ml-"
        onClick={() => setIsPopupOpen(true)}
      >
        <img src={micImage} alt="mic" className="w-6 h-6 object-contain" />
      </button>

      {isPopupOpen && (
        <VoiceSearchPopup
          onClose={() => setIsPopupOpen(false)}
          onStartListening={handleVoiceSearch}
          listening={listening}
        />
      )}

  <div className="h-6 mt-1 w-0.5 bg-gray-300 mx-2"></div>
  <div>
    <label
      title="Image Search"
      className="cursor-pointer text-lg text-white rounded-full"
      onClick={() => setIsModalOpen(true)}
    >
      <img src={cameraImage} alt="Upload" className="w-6 h-6 object-contain" />
    </label>

    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold " style={{ color: "#80B4FB" }}>Search by Image</h3>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-blue-400" style={{ hover: "#80B4FB" }}>✖</button>
          </div>
          
          <div 
            className="border-2 border-dashed rounded-lg p-8 mb-4 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className=" flex justify-center items-center mb-5 mx-auto text-red-500">
              <img src={camUpload} alt="mic" className="min-w-14 h-14 mt- ms- object-contain"/>
            </div>
            <p className="mt-2 text-sm text-gray-500">Drag and drop your image here, or</p>
            <button 
            style={{ backgroundColor: "#80B4FB" }}
              onClick={openFileSelector}
              className="mt-2 px-4 py-2  text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Browse Files
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex justify-end">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

          <div className='text-lg min-w-[50px] h-12 cursor-pointer bg-red-600 flex items-center justify-center rounded-r-full text-white'>
            <GrSearch />
          </div>
          </div>
          
         
        <div className='flex items-center gap-7'>
          <div className='relative flex justify-center'>
            {user?._id && (
              <div
                className='text-3xl cursor-pointer relative flex justify-center'
                onClick={() => setMenuDisplay(prev => !prev)}
              >
                {user?.profilePic ? (
                  <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
            )}

            {menuDisplay && (
              <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded'>
                <nav>
                  {user?.role === ROLE.ADMIN && (
                    <Link to={'/admin-panel/all-products'} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(prev => !prev)}>
                      Admin Panel
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </div>

          {user?._id && (
            <Link to={'/cart'} className='text-2xl relative'>
              <span>
                <FaShoppingCart />
              </span>
              <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                <p className='text-sm'>{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          <div>
            {user?._id ? (
              <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>
                Logout
              </button>
            ) : (
              <Link to={'/login'} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      
    {showModal && image && (
      <ImageUploadModal
        image={image}
        // aspectRatios={aspectRatios}
        open={showModal}
        handleClose={() => setShowModal(false)}
        getCroppedImage={handleCroppedImage}
      />
    )}
    </header>
  );
};

export default Header;
