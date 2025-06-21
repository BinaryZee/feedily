
import Link from 'next/link';
import React from 'react';

const Button = ({name,href}) => {
    return <Link href={href}><button className='bg-black w-32 h-16 rounded-xl text-white text-xl cursor-pointer'>{name}</button></Link>
}

export default Button;
