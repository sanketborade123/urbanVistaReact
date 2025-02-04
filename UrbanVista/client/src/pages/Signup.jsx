import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const[formData,setFormData] = useState({});
  const[error,setError]=useState(null);
  const[loading,setLoading]=useState(false);
  const navigate=useNavigate();
  
  const handleChange =(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    });
  };
  
  const handleSubmit =async(e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const res=await fetch('/api/auth/signup',
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
          setLoading(false);
          setError(data.message);
          return;
        }
        setLoading(false);    
        setError(null);
        navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='w-full max-w-md mx-4'>
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
          <h1 className='text-3xl font-bold text-center text-gray-800 mb-2'>Create Account</h1>
          <p className='text-center text-gray-600 mb-8'>Join us today and get started</p>
          
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <input 
                type='text' 
                placeholder='Username' 
                className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors bg-gray-50'
                id='username'
                onChange={handleChange}
              />
            </div>
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>Or continue with</span>
            </div>
          </div>
          
          <div className='w-full'>
            <OAuth />
          </div>
          
          <p className='mt-6 text-center text-gray-600'>
            Already have an account?{' '}
            <Link to="/sign-in" className='text-gray-900 font-medium hover:underline'>
              Sign in
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