"use client"
import { CircleUser } from 'lucide-react';
import { useAuth } from "@clerk/nextjs";
import { useClerk } from '@clerk/nextjs';
import { useState } from 'react';

const Navbar = () => {
    const { isSignedIn } = useAuth();
    const { signOut, openSignIn } = useClerk();
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className='w-full h-[15%] flex justify-between items-center px-10 mb-4 relative'>
            <h1 className={`text-[96px] font-bold tracking-[-4px] font-sans`}>Feedily</h1>
            <div className="relative">
                <CircleUser 
                    size={68} 
                    className='cursor-pointer hover:opacity-80 transition-opacity'
                    onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        {isSignedIn ? (
                            <button
                                onClick={() => signOut()}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <button
                                onClick={() => openSignIn()}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                )}
            </div>
            {/* Click outside to close dropdown */}
            {showDropdown && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
}

export default Navbar;