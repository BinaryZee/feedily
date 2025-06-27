"use client"
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const FeedbackAnimation = () => {
    return (
            <DotLottieReact
                className='h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] md:h-full md:w-[110%]'
                src="/feedback.lottie"
                loop
                autoplay
            />
        
    );
}

export default FeedbackAnimation;