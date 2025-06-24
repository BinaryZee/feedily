import { CircleUser } from 'lucide-react';
const Navbar = () => {
    return (
        <div className='w-full h-[15%] flex justify-between items-center px-10 mb-4' >
            <h1 className={`text-[96px] font-bold tracking-[-4px] font-sans`}>Feedily</h1>
            <CircleUser size={68} className='cursor-pointer'/>
        </div>
    );
}

export default Navbar;
