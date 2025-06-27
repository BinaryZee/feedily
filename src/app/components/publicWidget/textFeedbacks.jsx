"use client"
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../utils/supabase'; 

const TextFeedbacks = ({ link }) => {
    const supabase = createClient()
    const [feedbacks, setFeedbacks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('feedbacks')
                    .select('feedbacks')
                    .eq('link', link)
                    .maybeSingle();

                if (error) throw error;
                setFeedbacks(data?.feedbacks || {});
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [link]);

    if (loading) return (
        <div className='flex w-full h-[300px] md:w-[30vw] md:aspect-square border rounded-2xl items-center justify-center p-4'>
            Loading...
        </div>
    );
    
    if (error) return (
        <div className='flex w-full h-[300px] md:w-[30vw] md:aspect-square border rounded-2xl items-center justify-center p-4 text-red-500'>
            Error: {error}
        </div>
    );

    return (
        <div className='flex w-full h-[300px] md:w-[30vw] md:aspect-square border rounded-2xl p-4 overflow-auto bg-white'>
            {feedbacks && Object.keys(feedbacks).length > 0 ? (
                <div className="w-full space-y-4">
                    {Object.entries(feedbacks).map(([userName, userFeedbacks]) => (
                        <div key={userName} className="mb-4 last:mb-0">
                            <h3 className="font-bold text-md md:text-lg">{userName}</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                {userFeedbacks.map((feedback, index) => (
                                    <li key={index} className="text-sm md:text-base">
                                        {feedback}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full flex items-center justify-center text-gray-500 text-sm md:text-base">
                    No feedbacks yet for this widget
                </div>
            )}
        </div>
    );
};

export default TextFeedbacks;