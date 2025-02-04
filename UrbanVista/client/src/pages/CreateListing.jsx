import React, { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const { currentUser } = useSelector(state => state.user);
    const [files, setFiles] = useState([]);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: 'rent',
        bedRooms: 1,
        bathRooms: 1,
        regularPrice: 3000,
        discountedPrice: 0,
        parking: false,
        offer: false,
        furnished: false,
    });

    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) => {
                setImageUploadError('Image upload failed.. (max 2 MB/img)');
                setUploading(false);
            });
        } else {
            setImageUploadError('Only six images are allowed..');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === 'sell' || e.target.id === 'rent') {
            setFormData({
                ...formData, type: e.target.id
            });
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            });
        }
        if (e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            });
        }
        if (e.target.id === 'bathRooms' || e.target.id === 'bedRooms' || e.target.id === 'regularPrice' || e.target.id === 'discountedPrice') {
            setFormData({
                ...formData,
                [e.target.id]: parseInt(e.target.value)
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError('At least one image is required...');
            if (formData.regularPrice < formData.discountedPrice) return setError('Discounted price must be lower than regular price...');
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                }),
            });

            const data = await res.json();
            setLoading(false);

            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='font-bold text-3xl text-center my-7'>Create a Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength={62} minLength={10} required onChange={handleChange} value={formData.name} />
                    <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required onChange={handleChange} value={formData.description} />
                    <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required onChange={handleChange} value={formData.address} />

                    <div className='flex gap-6 flex-wrap mt-3'>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sell' className='w-5' onChange={handleChange} checked={formData.type === 'sell'} />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={formData.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-6 mt-3'>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type='number' id='bedRooms' max={10} min={1} required onChange={handleChange} value={formData.bedRooms} />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type='number' id='bathRooms' max={10} min={1} required onChange={handleChange} value={formData.bathRooms} />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type='number' id='regularPrice' max={1000000} min={3000} required onChange={handleChange} value={formData.regularPrice} />
                            <div className=' flex flex-col items-center'>
                                <p>Regular Price</p>
                                {formData.type === 'rent' && (
                                <span className='text-xs'>(Rs. / month)</span>
                                )}
                            </div>
                        </div>
                        {formData.offer &&
                            (
                                <div className='flex items-center gap-2'>
                                    <input className='p-3 border border-gray-300 rounded-lg' type='number' id='discountedPrice' max={1000000} min={0} required onChange={handleChange} value={formData.discountedPrice} />
                                    <div className='flex flex-col items-center'>
                                        <p>Discounted Price</p>
                                        {formData.type === 'rent' && (
                                            <span className='text-xs'>(Rs. / month)</span>
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                <div className='flex flex-col flex-1 gap-5 ml-4 mt-2'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-500 ml-2'>The first image will be cover (max 6)</span>
                    </p>
                    <div className='flex gap-4 mt-3'>
                        <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full cursor-pointer' type='file' id='images' accept='image/*' multiple/>
                        <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 border text-green-600 border-green-700  rounded uppercase hover:opacity-80 disabled:opacity-80'>{uploading ? 'uploading..' : 'Upload'}</button>
                    </div>

                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className='flex justify-between p-3 border items-center '>
                                <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                                <button onClick={() => handleRemoveImage(index)} type='button' className='p-3 text-red-700 uppercase hover:opacity-80 cursor-pointer '>Delete</button>
                            </div>
                        ))
                    }

                    <button disabled={loading || uploading} className='p-3 bg-slate-700 rounded-lg uppercase text-white hover:opacity-80 cursor-pointer disabled:opacity-80 mt-4'>{loading ? 'Creating..' : 'Create Listing'}</button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </main>
    )
}