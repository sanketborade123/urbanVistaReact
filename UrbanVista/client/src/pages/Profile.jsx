import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, list, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart,updateUserSuccess,updateUserFailure ,deleteUserStart,deleteUserSuccess,deleteUserFailure,
signOutUserStart, signOutUserFailure, signOutUserSuccess} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';


export default function Profile() {
  const { currentUser,loading,error } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [showListingsError,setShowListingsError]=useState(false); 
  const [userListings,setUserListings]=useState([]);


  const dispatch=useDispatch();



  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; 
    const storageRef = ref(storage, fileName); 
    const uploadTask = uploadBytesResumable(storageRef, file); 

    uploadTask.on(
      'state_changed',
      (snapshot) => {

        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress)); 
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        setFileUploadError(true);
        console.error('Upload Error:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleDeleteUser=async(e)=>{
    try {
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      

      const data=await res.json();
              console.log(data);
              if(data.success===false){
                dispatch(deleteUserFailure(data.message));
                return;
              }
              dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };


  const handleChange =(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  };


  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res=await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });
      const data=await res.json();
              console.log(data);
              if(data.success===false){
                dispatch(updateUserFailure(data.message));
                return;
              }
              dispatch(updateUserSuccess(data));
              setUpdateSuccess(true);
    } catch (error) {
      dispatch(UpdateUserFailure(error.message));
    }
  };

  const handleSignOut=async(e)=>{
    try {
      dispatch(signOutUserStart());
      const res=await fetch('/api/auth/signout');
      const data=await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
};


const handleShowListings = async()=>{

    try {
      setShowListingsError(false);
      const res= await fetch(`/api/user/listings/${currentUser._id}`);
      const data=await res.json();
      if(data.success === false){
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
};


const handleListingDelete =async(listingId)=>{

  try {
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',
      }
      );
      const data=await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }

      setUserListings((prev)=>prev.filter((listing)=>listing.id !== listingId));

  } catch (error) {
    console.log(error.message);
  }
};


  return (
    <div className="max-w-lg p-3 mx-auto ">
      <h1 className="text-3xl text-center font-semibold my-3 text-red-400">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar ||currentUser.avatar}
          alt="Profile"
          className="rounded-full h-36 w-34 object-cover cursor-pointer self-center"
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className="text-red-700">Image upload error(size must be less than 2MB)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span> 
          ) : filePerc === 100 ? (
            <span className="text-green-600">Upload Successful...</span>
          ) : (
            ''
          )}
        </p>
        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 h-1 rounded-full">
          <div
            className="absolute bg-green-500 h-full rounded-full"
            style={{ width: `${filePerc}%` }}
          ></div>
        </div>
        <input defaultValue={currentUser.username} type="text" placeholder="username" className="border p-3 rounded-lg" id="username" onChange={handleChange}/>
        <input defaultValue={currentUser.email} type="email" placeholder="email" className="border p-3 rounded-lg" id="email" onChange={handleChange}/>
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-neutral-700 text-white p-3 rounded-lg uppercase hover:opacity-85 disabled:opacity-80">{loading ? 'loading..':'update'}</button>
        <Link className='bg-green-600 text-white p-3 uppercase hover:opacity-85 text-center' to={'/create-listing'}>Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-500 cursor-pointer ">Delete the Account</span>
        <span onClick={handleSignOut} className="text-red-500 cursor-pointer ">Sign out</span>
      </div>
      <p className='text-red-700 mt-4'>{error ? error: '' }</p>
      <p className='text-green-600 mt-5'>{updateSuccess ? 'Updated user successfully...!':''}</p>
      
      <button onClick={handleShowListings} className='text-green-700 uppercase w-full'>Show Listings</button>
      <p className='text-red-700 mt-4'>{showListingsError ? ' while loading lists...': '' }</p>    

      
      {userListings && userListings.length > 0 &&
      
      <div className='flex flex-col gap-4'>
      <h1 className='font-bold text-slate-800 text-center mt-7 text-2xl'>Your listings</h1>

      {userListings.map((listing)=>

      <div key={listing._id} className='p-3 flex justify-between rounded-lg border mt-4 items-center gap-6'>
        <Link to={`/listing/${listing._id}`}><img src={listing.imageUrls[0]} alt='listing cover' className='h-17 w-24 object-contain mt-5'/></Link>
        <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/listing/${listing._id}`}>
        <p>{listing.name}</p>
        </Link>

        <div className='flex flex-col items-center'>
        <button onClick={()=> handleListingDelete(listing._id)} className='p-3 uppercase rounded-lg text-red-600'>delete</button>
        <Link to={`/update-listing/${listing._id}`}>
          <button className='p-3 uppercase rounded-lg text-green-600'>edit</button>
        </Link>
 

        </div>

        </div>
      )}
      
      
      </div>
      }
    </div>
  );
}
