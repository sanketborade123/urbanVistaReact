import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const[formData,setFormData] = useState({});
  const{loading,error}=useSelector((state) =>state.user);
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const handleChange =(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    });
  };
  
  const handleSubmit =async(e)=>{
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res=await fetch('/api/auth/signin',
        {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify(formData),
        });
        const data=await res.json();
        console.log(data);
        if(data.success===false){
          dispatch(signInFailure(data.message));
          return;
        }
        dispatch(signInSuccess(data));
        navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='w-full max-w-md mx-4'>
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
          <h1 className='text-3xl font-bold text-center text-gray-800 mb-2'>Welcome Back</h1>
          <p className='text-center text-gray-600 mb-8'>Sign in to your account</p>
          
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <input 
                type='email' 
                placeholder='Email address' 
                className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors bg-gray-50'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <input 
                type='password' 
                placeholder='Password' 
                className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors bg-gray-50'
                id='password'
                onChange={handleChange}
              />
            </div>
            <button 
              disabled={loading} 
              className='w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-70'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>Or continue with</span>
              </div>
            </div>
            
            <OAuth />
          </form>
          
          <p className='mt-6 text-center text-gray-600'>
            Don't have an account?{' '}
            <Link to="/sign-up" className='text-gray-900 font-medium hover:underline'>
              Sign up
            </Link>
          </p>
          
          {error && (
            <div className='mt-4 p-4 bg-red-50 border border-red-100 rounded-lg'>
              <p className='text-red-600 text-center text-sm'>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}