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

    if (loading) return <div className='flex aspect-square w-[30vw] border-1 rounded-2xl items-center justify-center'>Loading...</div>;
    if (error) return <div className='flex aspect-square w-[30vw] border-1 rounded-2xl items-center justify-center'>Error: {error}</div>;

    return (
        <div className='flex aspect-square w-[30vw] border-1 rounded-2xl p-4 overflow-auto'>
            {feedbacks && Object.keys(feedbacks).length > 0 ? (
                <div className="w-full">
                    {Object.entries(feedbacks).map(([userName, userFeedbacks]) => (
                        <div key={userName} className="mb-4">
                            <h3 className="font-bold text-lg">{userName}</h3>
                            <ul className="list-disc pl-5">
                                {userFeedbacks.map((feedback, index) => (
                                    <li key={index} className="my-1">{feedback}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full flex items-center justify-center text-gray-500">
                    No feedbacks yet for this widget
                </div>
            )}
        </div>
    );
};

export default TextFeedbacks;