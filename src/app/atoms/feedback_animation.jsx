"use client"
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const FeedbackAnimation = () => {
    return (
            <DotLottieReact
            className='h-[70%] w-[110%]'
            src="/feedback.lottie"
            loop
            autoplay
            />
    );
}

export default FeedbackAnimation;
