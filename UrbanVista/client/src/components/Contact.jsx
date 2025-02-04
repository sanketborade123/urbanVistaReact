import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
    const [landLord, setLandLord] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [message,setMessage]=useState(null);
    const onChange =(e)=>{
        setMessage(e.target.value);
    }

    useEffect(() => {
        const fetchLandLord = async () => {
            setLoading(true); 
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                 if (data.success === false) {
                   setError("Could not find landlord information")
                   setLoading(false);
                   return;
                 }
                setLandLord(data);
                setError(null) 
            } catch (error) {
                setError("Something went wrong while fetching landlord information") 
                console.error("Error fetching landlord:", error);
            } finally {
                setLoading(false); 
            }
        };
        fetchLandLord();
    }, [listing.userRef]);

    return (
        <>
            {loading && <p>Loading landlord information...</p>}
            {error && <p>{error}</p>}
            {landLord && !loading && !error && (
                <div className='flex flex-col gap-2'>
                    <p>Contact <span className='font-semibold'>{landLord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                    <textarea className='w-full p-3 rounded-lg border' name='message' id='message' rows={2} value={message} onChange={onChange} placeholder='Enter your message here..'></textarea>

                    <Link to={`mailto:${landLord.email}?subject=regarding ${listing.name}&body=${message}`} 
                    className='bg-slate-700 rounded-lg text-white text-center hover:opacity-90 p-3'>
                    Send message
                    </Link>

                </div>

            )}
        </>
    );
}